# Features

Running list of ideas, things in progress, and things shipped. Pick from the Backlog when there's time, move to Done with the version it shipped in.

## Backlog

- **Prediction-accuracy tracker** — for fixtures that have a `result`, compute hit-rate per verdict tier (Strong/Good/Moderate/Low) and show it in the header.
- **Filter UI** — sidebar toggles to show only Strong/Good picks, or only fixtures with edge > 5%.
- **CSV export** — download this weekend's picks as a spreadsheet.
- **Multi-bookmaker odds** — currently a single `bookOdds` field; support a few books and pick the best price.
- **Mobile UX polish** — tighter spacing on small screens, sticky verdict pill in the fixture row.
- **Backtest mode** — toggle to show all past fixtures with their predicted vs actual outcomes for a season-long view.

## Done

- **v2.9** — Backfilled 16 legacy results with actual scorelines (replaced `'home'`/`'draw'`/`'away'` with `'X-Y'`).
- **v2.8** — Replaced DRAW/HOME/AWAY result badges with actual scorelines. Past fixtures now show "Final Score: X – X" (with "· DRAW" in gold for draws) where the kick-off time used to be.
- **v2.7** — Auto-marked 14 results (Liverpool 1-1 Chelsea; Sunderland 0-0 Manchester United; Fulham 0-1 AFC Bournemouth, +11 more).
- **v2.6** — Auto-fetched 79 upcoming fixture stubs (Premier League 11, La Liga 23, Serie A 15, Bundesliga 12, Ligue 1 18). Pending deep research.
- **v2.5** — Split topbar timestamp into Page (last code change) and Data (last fixture/results update). Auto-fetch fixtures workflow (`fetch-fixtures.js` + `fetch-fixtures.yml`) pulls upcoming stubs from football-data.org every Monday. Auto-mark schedule updated to 5pm + 11pm BST.
- **v2.4** — Auto-mark results workflow. Daily action queries football-data.org for finished matches and patches `result:` in `index.html`, then auto-commits. Works alongside the existing verify-fixtures workflow without retriggering it.
- **v2.3** — `CLAUDE.md` added with the after-every-edit convention (bump version, update FEATURES, refresh README if user-visible). Auto-loaded into every Claude session.
- **v2.2** — "Past fixtures" toggle in the sidebar (Display section). Default is upcoming-only; toggle ON to include played fixtures with their result badges.
- **v2.1** — Page-updated timestamp in the topbar; version display bumped from v2.
- **v2.1** — `FEATURES.md` (this file).
- **v2.0** — Kick-off time colour fixed (was `--text3` on a near-identical surface, now `--text2`).
- **v2.0** — Fixture verification workflow against football-data.org (daily + on push).
- **v2.0** — README refreshed to match current code (8 leagues, book-odds/edge feature, verification workflow).
- **v2.0** — Value/edge calculation comparing book odds against fair odds.
- **v2.0** — All Fixtures view as the default landing page.
- **v2.0** — Eight competitions: PL, La Liga, Serie A, Bundesliga, Ligue 1, UCL, UEL, UECL.
