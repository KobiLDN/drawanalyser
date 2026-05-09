# Draw Analyser

A football draw probability tool with deep-research analysis per fixture across European leagues and competitions.

## Live site

https://kobildn.github.io/drawanalyser/

## What it covers

Eight competitions: Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, Conference League.

Each fixture is annotated with:

- Recent form and league position
- Confirmed team news (injuries, suspensions, key players)
- Tactical context and motivation
- Head-to-head history
- Draw probability score (0-100) and verdict tier (Low / Moderate / Good / Strong)
- Fair odds estimate, plus book odds and edge calculation when available

## Updating each gameweek

Fixtures live in the `LEAGUES` array in `index.html`. Open this folder in Claude Code and run:

```
Research the upcoming gameweeks across the listed leagues. For each fixture:
- Search for team news, injuries, form
- Check H2H and motivation context
- Update the LEAGUES array in index.html
- Commit and push
```

## Fixture verification

A GitHub Action (`.github/workflows/verify-fixtures.yml`) runs daily and on push, comparing the `LEAGUES` array against ground truth from [football-data.org](https://www.football-data.org/). It flags wrong dates, wrong matchups, and missing fixtures so they can be corrected before kick-off.

Requires `FOOTBALL_DATA_API_KEY` to be set as a repo secret.

## Marking results

A second GitHub Action (`.github/workflows/mark-results.yml`) runs at 5pm and 11pm BST daily, queries football-data.org for finished matches, and writes `result: 'home' | 'draw' | 'away'` back into the `LEAGUES` array — then auto-commits as `github-actions[bot]`. The toggle in the sidebar's Display section lets you flip between "upcoming only" and "include past fixtures" so you can see the result badges (DRAW / HOME / AWAY) once they're populated.

Manual fallback: edit the fixture object directly to set `result:` if the workflow misses one.

## Auto-fetching fixtures

A third GitHub Action (`.github/workflows/fetch-fixtures.yml`) runs every Monday at 08:00 UTC and inserts stub fixtures for the coming week. Stubs have placeholder analysis (all factors set to 50, verdict "Low") — deep research is added manually afterwards. Trigger it on demand via **Actions → Auto-fetch fixtures → Run workflow** (supports an optional `days_ahead` input, default 8).

## Local development

Just open `index.html` in a browser. No build step, no dependencies.
