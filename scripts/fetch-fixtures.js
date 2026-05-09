#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error('FOOTBALL_DATA_API_KEY not set');
  process.exit(2);
}

// How many days ahead to fetch. Defaults to 8 (next week).
const DAYS_AHEAD = parseInt(process.env.DAYS_AHEAD || '8', 10);

const COMP = {
  pl: 'PL', laliga: 'PD', seriea: 'SA',
  bundesliga: 'BL1', ligue1: 'FL1', ucl: 'CL'
};

const TZ = {
  pl: 'Europe/London', laliga: 'Europe/Madrid', seriea: 'Europe/Rome',
  bundesliga: 'Europe/Berlin', ligue1: 'Europe/Paris', ucl: 'Europe/London'
};

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function escapeJs(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function loadLeagues(html) {
  const m = html.match(/const LEAGUES = (\[[\s\S]*?\n\]);\s*\n\s*\n\s*\/\/ ═══/);
  if (!m) throw new Error('Could not extract LEAGUES from index.html');
  return eval(m[1]);
}

function localParts(utcIso, tz) {
  const d = new Date(utcIso);
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(d);
  const get = t => fmt.find(p => p.type === t).value;
  return {
    day: `${get('weekday')} ${get('day')} ${get('month')}`,
    time: `${get('hour')}:${get('minute')}`
  };
}

function teamLabel(t) {
  // Prefer shortName, but use the full name if it's clearly a recognisable form
  const sn = (t.shortName || '').trim();
  const n = (t.name || '').trim();
  // Strip noise suffixes from full name for a cleaner label
  let preferred = sn || n;
  // If shortName is a less common variant (e.g. "Brighton Hove"), fall back to a stripped name
  if (sn && /\bhove\b/i.test(sn)) preferred = n.replace(/ FC$/i, '');
  return preferred;
}

async function fetchScheduled(comp, dateFrom, dateTo) {
  const url = `https://api.football-data.org/v4/competitions/${comp}/matches?status=SCHEDULED,TIMED&dateFrom=${dateFrom}&dateTo=${dateTo}`;
  const r = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.matches || [];
}

function formatFixtureLiteral(f) {
  return `      {
        day: '${escapeJs(f.day)}',
        home: '${escapeJs(f.home)}', away: '${escapeJs(f.away)}', time: '${f.time}',
        result: null, drawProbability: 25, verdict: 'Low', fairOdds: '4.00–4.50',
        factors: {
          formBalance:   { score: 50, detail: 'Pending research.' },
          drawRates:     { score: 50, detail: 'Pending research.' },
          headToHead:    { score: 50, detail: 'Pending research.' },
          goalTendency:  { score: 50, detail: 'Pending research.' },
          leagueContext: { score: 50, detail: 'Pending research.' }
        },
        summary: 'Pending deep research.'
      }`;
}

// Walk through HTML to find the closing ']' of a league's fixtures array, with bracket counting
// that's aware of strings and escapes.
function findFixturesClose(html, leagueId) {
  const idMatch = html.match(new RegExp(`id: '${escapeRegex(leagueId)}'`));
  if (!idMatch) return -1;
  const fixIdx = html.indexOf('fixtures: [', idMatch.index);
  if (fixIdx === -1) return -1;
  let depth = 1;
  let pos = fixIdx + 'fixtures: ['.length;
  while (pos < html.length && depth > 0) {
    const c = html[pos];
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      pos++;
      while (pos < html.length) {
        if (html[pos] === '\\') { pos += 2; continue; }
        if (html[pos] === quote) { pos++; break; }
        pos++;
      }
      continue;
    }
    if (c === '/' && html[pos + 1] === '/') {
      while (pos < html.length && html[pos] !== '\n') pos++;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return pos;
    }
    pos++;
  }
  return -1;
}

function appendFixtures(html, leagueId, newFixtures) {
  if (!newFixtures.length) return html;
  const closeIdx = findFixturesClose(html, leagueId);
  if (closeIdx === -1) throw new Error(`Could not locate fixtures close for league ${leagueId}`);
  // Walk backwards from closeIdx to find the last non-whitespace character before ']'
  let i = closeIdx - 1;
  while (i > 0 && /\s/.test(html[i])) i--;
  // i now points to the last meaningful char. If it's '[', the array is empty.
  // Otherwise, we need a comma after it.
  const isEmpty = html[i] === '[';
  const fixturesText = newFixtures.map(formatFixtureLiteral).join(',\n\n');
  const insertion = isEmpty
    ? `\n\n${fixturesText}\n    `
    : `,\n\n${fixturesText}\n    `;
  return html.slice(0, i + 1) + insertion + html.slice(closeIdx);
}

function bumpVersion(html) {
  const m = html.match(/<span>v(\d+)\.(\d+) · 2025–26<\/span>/);
  if (!m) throw new Error('Could not find version in topbar');
  const next = `${m[1]}.${+m[2] + 1}`;
  return {
    html: html.replace(m[0], `<span>v${next} · 2025–26</span>`),
    version: `v${next}`
  };
}

function refreshDataTimestamp(html) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  const ts = `${get('day')} ${get('month')} ${get('year')} ${get('hour')}:${get('minute')} BST`;
  return html.replace(/<div class="updated-tag">Data · [^<]+<\/div>/, `<div class="updated-tag">Data · ${ts}</div>`);
}

function addFeaturesEntry(features, version, perLeague) {
  const summary = perLeague.map(p => `${p.league} ${p.count}`).join(', ');
  const total = perLeague.reduce((s, p) => s + p.count, 0);
  const entry = `- **${version}** — Auto-fetched ${total} upcoming fixture stubs (${summary}). Pending deep research.\n`;
  return features.replace(/(## Done\n\n)/, `$1${entry}`);
}

(async () => {
  const root = path.join(__dirname, '..');
  const indexPath = path.join(root, 'index.html');
  const featuresPath = path.join(root, 'FEATURES.md');

  let html = fs.readFileSync(indexPath, 'utf8');
  let features = fs.readFileSync(featuresPath, 'utf8');

  const LEAGUES = loadLeagues(html);

  // Compute date range: tomorrow → tomorrow + DAYS_AHEAD
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 1);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + DAYS_AHEAD);
  const dateFrom = start.toISOString().slice(0, 10);
  const dateTo = end.toISOString().slice(0, 10);

  console.log(`Fetching fixtures from ${dateFrom} → ${dateTo}`);

  const perLeague = [];

  for (const league of LEAGUES) {
    const comp = COMP[league.id];
    const tz = TZ[league.id];
    if (!comp) {
      console.log(`-- skip ${league.name} (not on free tier)`);
      continue;
    }

    let api;
    try {
      api = await fetchScheduled(comp, dateFrom, dateTo);
    } catch (e) {
      console.error(`✗ ${league.name}: ${e.message}`);
      continue;
    }
    if (!api.length) {
      console.log(`-- ${league.name}: no upcoming fixtures in window`);
      continue;
    }

    // Build a Set of existing (home|away|day) keys to dedupe
    const existing = new Set(league.fixtures.map(f => `${f.home}|${f.away}|${f.day}`));

    const fresh = [];
    for (const m of api) {
      const parts = localParts(m.utcDate, tz);
      const home = teamLabel(m.homeTeam);
      const away = teamLabel(m.awayTeam);
      const key = `${home}|${away}|${parts.day}`;
      if (existing.has(key)) continue;
      fresh.push({ home, away, day: parts.day, time: parts.time });
      existing.add(key);
    }

    if (!fresh.length) {
      console.log(`-- ${league.name}: all ${api.length} already in repo`);
      continue;
    }

    console.log(`+ ${league.name}: ${fresh.length} new fixtures`);
    fresh.forEach(f => console.log(`    ${f.day} ${f.time}  ${f.home} vs ${f.away}`));

    html = appendFixtures(html, league.id, fresh);
    perLeague.push({ league: league.name, count: fresh.length });
  }

  if (!perLeague.length) {
    console.log('\nNothing new to add.');
    return;
  }

  const bumped = bumpVersion(html);
  html = refreshDataTimestamp(bumped.html);
  features = addFeaturesEntry(features, bumped.version, perLeague);

  fs.writeFileSync(indexPath, html);
  fs.writeFileSync(featuresPath, features);

  const total = perLeague.reduce((s, p) => s + p.count, 0);
  console.log(`\nAdded ${total} fixtures → ${bumped.version}`);
})().catch(e => { console.error('Fatal:', e); process.exit(2); });
