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

After matches are played, add `result: 'draw' | 'home' | 'away'` to each fixture object to display result badges.

## Local development

Just open `index.html` in a browser. No build step, no dependencies.
