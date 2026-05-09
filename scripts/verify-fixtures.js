#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error('FOOTBALL_DATA_API_KEY not set');
  process.exit(2);
}

const COMP = {
  pl: 'PL', laliga: 'PD', seriea: 'SA',
  bundesliga: 'BL1', ligue1: 'FL1', ucl: 'CL'
};

const TZ = {
  pl: 'Europe/London', laliga: 'Europe/Madrid', seriea: 'Europe/Rome',
  bundesliga: 'Europe/Berlin', ligue1: 'Europe/Paris', ucl: 'Europe/London'
};

const MONTHS = {
  January:0, February:1, March:2, April:3, May:4, June:5,
  July:6, August:7, September:8, October:9, November:10, December:11
};

function loadLeagues() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const m = html.match(/const LEAGUES = (\[[\s\S]*?\n\]);\s*\n\s*\n\s*\/\/ ═══/);
  if (!m) throw new Error('Could not extract LEAGUES from index.html');
  return eval(m[1]);
}

function fixtureLocalDate(dayStr, timeStr, year) {
  const [, dd, mon] = dayStr.split(/\s+/);
  return { y: year, m: MONTHS[mon], d: +dd, hh: +timeStr.split(':')[0], mm: +timeStr.split(':')[1] };
}

function apiLocalParts(utcIso, tz) {
  const d = new Date(utcIso);
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(d);
  const get = t => +fmt.find(p => p.type === t).value;
  return { y: get('year'), m: get('month') - 1, d: get('day'), hh: get('hour'), mm: get('minute') };
}

function partsEqual(a, b) {
  return a.y === b.y && a.m === b.m && a.d === b.d && a.hh === b.hh && a.mm === b.mm;
}

function partsDateEqual(a, b) {
  return a.y === b.y && a.m === b.m && a.d === b.d;
}

function normTeam(s) {
  return s.toLowerCase()
    .replace(/\bfc\b/g, '')
    .replace(/\bafc\b/g, '')
    .replace(/\bcf\b/g, '')
    .replace(/\bsc\b/g, '')
    .replace(/\bbk\b/g, '')
    .replace(/\bclub\b/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ').trim();
}

function teamMatch(a, b) {
  const na = normTeam(a), nb = normTeam(b);
  if (na === nb) return true;
  return na.includes(nb) || nb.includes(na);
}

async function fetchMatches(comp, dateFrom, dateTo) {
  const url = `https://api.football-data.org/v4/competitions/${comp}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  const r = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
  if (r.status === 429) throw new Error('rate-limited');
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.matches || [];
}

(async () => {
  const LEAGUES = loadLeagues();
  const errors = [];
  const warnings = [];
  let checked = 0;

  for (const league of LEAGUES) {
    const comp = COMP[league.id];
    const tz = TZ[league.id];
    if (!comp) {
      console.log(`-- skip ${league.name} (${league.id}) — not on free tier`);
      continue;
    }

    const upcoming = league.fixtures.filter(f => !f.result);
    if (!upcoming.length) {
      console.log(`-- ${league.name}: no upcoming fixtures`);
      continue;
    }

    const year = new Date().getFullYear();
    const dates = upcoming.map(f => fixtureLocalDate(f.day, f.time, year));
    const minD = new Date(Date.UTC(year, Math.min(...dates.map(d => d.m)), Math.min(...dates.map(d => d.d))));
    const maxD = new Date(Date.UTC(year, Math.max(...dates.map(d => d.m)), Math.max(...dates.map(d => d.d))));
    const dateFrom = minD.toISOString().slice(0, 10);
    const dateTo = maxD.toISOString().slice(0, 10);

    let api;
    try {
      api = await fetchMatches(comp, dateFrom, dateTo);
    } catch (e) {
      errors.push(`[${league.name}] API fetch failed: ${e.message}`);
      console.error(`✗ ${league.name}: ${e.message}`);
      continue;
    }

    console.log(`\n=== ${league.name} — ${upcoming.length} fixtures vs ${api.length} from API ===`);

    for (const f of upcoming) {
      checked++;
      const expected = fixtureLocalDate(f.day, f.time, year);
      const candidates = api.filter(m => teamMatch(m.homeTeam.shortName || m.homeTeam.name, f.home) &&
                                          teamMatch(m.awayTeam.shortName || m.awayTeam.name, f.away));

      if (!candidates.length) {
        const msg = `${f.home} vs ${f.away} — not found in API for ${f.day}`;
        errors.push(`[${league.name}] ${msg}`);
        console.log(`  ✗ ${msg}`);
        continue;
      }

      const match = candidates[0];
      const apiParts = apiLocalParts(match.utcDate, tz);

      if (partsEqual(expected, apiParts)) {
        console.log(`  ✓ ${f.home} vs ${f.away} | ${f.day} ${f.time}`);
      } else if (partsDateEqual(expected, apiParts)) {
        const msg = `${f.home} vs ${f.away}: time mismatch — repo ${f.time} vs API ${String(apiParts.hh).padStart(2,'0')}:${String(apiParts.mm).padStart(2,'0')} (${tz})`;
        warnings.push(`[${league.name}] ${msg}`);
        console.log(`  ⚠ ${msg}`);
      } else {
        const apiDay = `${apiParts.y}-${String(apiParts.m+1).padStart(2,'0')}-${String(apiParts.d).padStart(2,'0')}`;
        const expDay = `${expected.y}-${String(expected.m+1).padStart(2,'0')}-${String(expected.d).padStart(2,'0')}`;
        const msg = `${f.home} vs ${f.away}: date mismatch — repo ${expDay} ${f.time} vs API ${apiDay} ${String(apiParts.hh).padStart(2,'0')}:${String(apiParts.mm).padStart(2,'0')}`;
        errors.push(`[${league.name}] ${msg}`);
        console.log(`  ✗ ${msg}`);
      }
    }
  }

  console.log(`\n──────────────────────────────`);
  console.log(`Checked ${checked} fixtures`);
  console.log(`Errors:   ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length) {
    console.log(`\nErrors:`);
    errors.forEach(e => console.log(`  • ${e}`));
    process.exit(1);
  }
  if (warnings.length) {
    console.log(`\nWarnings (review only — not failing):`);
    warnings.forEach(w => console.log(`  • ${w}`));
  }
})().catch(e => {
  console.error('Fatal:', e);
  process.exit(2);
});
