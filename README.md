# Draw Analyser

A football draw probability tool with deep-research analysis per fixture across European leagues and competitions.

## Live site

https://kobildn.github.io/drawanalyser/

## How it works

Each gameweek, the `FIXTURES` array in `index.html` is updated with researched data for upcoming matches:

- Recent form and league position
- Confirmed team news (injuries, suspensions, key players)
- Tactical context and motivation
- Head-to-head history
- Draw probability score (0-100)
- Verdict tier: Low / Moderate / Good / Strong
- Fair odds estimate

## Updating each gameweek

Open this folder in Claude Code and run something like:

```
Research the upcoming Premier League gameweek. For each fixture:
- Search for team news, injuries, form
- Check H2H and motivation context
- Update the FIXTURES array in index.html
- Commit and push
```

## Local development

Just open `index.html` in a browser. No build step, no dependencies.

## Marking results

After matches are played, add `result: 'draw' | 'home' | 'away'` to each fixture object to display result badges.
