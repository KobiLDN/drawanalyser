# Features

Running list of ideas, things in progress, and things shipped. Pick from the Backlog when there's time, move to Done with the version it shipped in.

## Collaboration process

- Read `AGENTS.md` first, then `CHANGELOG.md`, before making edits.
- Before editing, run: `git checkout main` then `git pull --rebase`.
- After editing, prepend one row to `CHANGELOG.md` directly under the table header (**`YYYY-MM-DD HH:MM BST`**, AI Name, Changed) — **newest first**.
- If user-visible behavior changed, add a **Done** entry below with version/date context.
- Keep each AI session focused on one intent where possible (smaller diffs, easier merges).

## Backlog

- **Prediction-accuracy tracker** — for fixtures that have a `result`, compute hit-rate per verdict tier (Strong/Good/Moderate/Low) and show it in the header.
- **Filter UI** — sidebar toggles to show only Strong/Good picks, or only fixtures with edge > 5%.
- **CSV export** — download this weekend's picks as a spreadsheet.
- **Multi-bookmaker odds** — currently a single `bookOdds` field; support a few books and pick the best price.
- **Mobile UX polish** — tighter spacing on small screens, sticky verdict pill in the fixture row.
- **Backtest mode** — toggle to show all past fixtures with their predicted vs actual outcomes for a season-long view.

## Done

- **v2.15** — Fixture list now has aligned headings for Fixture, League, Research, Draw Probability, and Draw Signal; table width, expanded details, and small text sizing were tuned for readability.
- **v2.14** — Verdict colours now follow a traffic-light scale: Low red, Moderate amber, Good green, Strong blue; matching percentage text and mini-bars improve scanability.
- **v2.13** — `CHANGELOG.md` first column uses **date + time** (`YYYY-MM-DD HH:MM BST`); docs updated for prepend workflow field.
- **v2.12** — `CHANGELOG.md` reordered **newest-first** with the column format line at the top; prepend workflow documented in `AGENTS.md`, `README.md`, `FEATURES.md`.
- **v2.11** — Improved readability of low-contrast labels by making `Fair draw odds` white and updating shared `--text3` color token to white in `index.html`. Added table-based `CHANGELOG.md` and multi-AI workflow guidance in docs.
- **v2.10** — Auto-marked 13 results (Nottingham Forest 1-1 Newcastle United; Crystal Palace 2-2 Everton; Burnley 2-2 Aston Villa, +10 more).
- **v2.9** — Backfilled 16 legacy results with actual scorelines (replaced `'home'`/`'draw'`/`'away'` with `'X-Y'`).
- **v2.8** — Replaced DRAW/HOME/AWAY result badges with actual scorelines. Past fixtures now show "Final Score: X – X" (with "· DRAW" in gold for draws) where the kick-off time used to be.
- **v2.7** — Auto-marked 14 results (Liverpool 1-1 Chelsea; Sunderland 0-0 Manchester United; Fulham 0-1 AFC Bournemouth, +11 more).
- **v2.6** — Auto-fetched 79 upcoming fixture stubs (Premier League 11, La Liga 23, Serie A 15, Bundesliga 12, Ligue 1 18). Pending deep research.
- **v2.5** — Split topbar timestamp into Page (last code change) and Data (last fixture/results update). Auto-fetch fixtures workflow (`fetch-fixtures.js` + `fetch-fixtures.yml`) pulls upcoming stubs from football-data.org every Monday. Auto-mark schedule updated to 5pm + 11pm BST.
- **v2.4** — Auto-mark results workflow. Daily action queries football-data.org for finished matches and patches `result:` in `index.html`, then auto-commits. Works alongside the existing verify-fixtures workflow without retriggering it.
- **v2.3** — `AGENTS.md` guide introduced (originally `CLAUDE.md`) with the after-every-edit convention (bump version, update docs for user-visible changes, keep commits focused).
- **v2.2** — "Past fixtures" toggle in the sidebar (Display section). Default is upcoming-only; toggle ON to include played fixtures with their result badges.
- **v2.1** — Page-updated timestamp in the topbar; version display bumped from v2.
- **v2.1** — `FEATURES.md` (this file).
- **v2.0** — Kick-off time colour fixed (was `--text3` on a near-identical surface, now `--text2`).
- **v2.0** — Fixture verification workflow against football-data.org (daily + on push).
- **v2.0** — README refreshed to match current code (8 leagues, book-odds/edge feature, verification workflow).
- **v2.0** — Value/edge calculation comparing book odds against fair odds.
- **v2.0** — All Fixtures view as the default landing page.
- **v2.0** — Eight competitions: PL, La Liga, Serie A, Bundesliga, Ligue 1, UCL, UEL, UECL.
