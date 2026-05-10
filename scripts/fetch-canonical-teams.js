#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error('FOOTBALL_DATA_API_KEY not set');
  process.exit(2);
}

const COMPETITIONS = {
  'PL': 'Premier League',
  'PD': 'La Liga',
  'SA': 'Serie A',
  'BL1': 'Bundesliga',
  'FL1': 'Ligue 1',
  'CL': 'Champions League'
};

async function fetchTeamsForCompetition(compCode) {
  const url = `https://api.football-data.org/v4/competitions/${compCode}/teams`;
  const r = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
  if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${compCode}: ${await r.text()}`);
  const j = await r.json();
  return (j.teams || []).map(t => ({
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    tla: t.tla,
    competition: COMPETITIONS[compCode]
  }));
}

(async () => {
  console.log('Fetching canonical team names from football-data.org...\n');
  
  const allTeams = [];
  const seenIds = new Set();
  
  for (const [compCode, compName] of Object.entries(COMPETITIONS)) {
    try {
      console.log(`Fetching ${compName} (${compCode})...`);
      const teams = await fetchTeamsForCompetition(compCode);
      
      for (const team of teams) {
        if (!seenIds.has(team.id)) {
          allTeams.push(team);
          seenIds.add(team.id);
        }
      }
      
      console.log(`  → ${teams.length} teams (${seenIds.size} total unique)`);
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
  }
  
  // Sort by ID for consistent output
  allTeams.sort((a, b) => a.id - b.id);
  
  const output = {
    generated: new Date().toISOString(),
    totalTeams: allTeams.length,
    teams: allTeams
  };
  
  const outPath = path.join(__dirname, '..', 'teams-canonical.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  
  console.log(`\n✓ Wrote ${allTeams.length} teams to teams-canonical.json`);
})().catch(e => { console.error('Fatal:', e); process.exit(2); });
