# Features

Running list of ideas, things in progress, and things shipped. Pick from the Backlog when there's time, move to Done with the version it shipped in.

## Backlog

- **Auto-mark results** — extend the verification workflow to also detect finished matches via football-data.org (`status: FINISHED`) and write `result: 'home' | 'draw' | 'away'` automatically.
- **Auto-fetch upcoming fixtures** — pull next gameweek's basic fixtures (teams, kick-off times, dates) from the API instead of hand-curating; deep research stays manual.
- **Prediction-accuracy tracker** — for fixtures that have a `result`, compute hit-rate per verdict tier (Strong/Good/Moderate/Low) and show it in the header.
- **Filter UI** — sidebar toggles to show only Strong/Good picks, or only fixtures with edge > 5%.
- **CSV export** — download this weekend's picks as a spreadsheet.
- **Multi-bookmaker odds** — currently a single `bookOdds` field; support a few books and pick the best price.
- **Mobile UX polish** — tighter spacing on small screens, sticky verdict pill in the fixture row.
- **Backtest mode** — toggle to show all past fixtures with their predicted vs actual outcomes for a season-long view.

## Done

- **v2.2** — "Past fixtures" toggle in the sidebar (Display section). Default is upcoming-only; toggle ON to include played fixtures with their result badges.
- **v2.1** — Page-updated timestamp in the topbar; version display bumped from v2.
- **v2.1** — `FEATURES.md` (this file).
- **v2.0** — Kick-off time colour fixed (was `--text3` on a near-identical surface, now `--text2`).
- **v2.0** — Fixture verification workflow against football-data.org (daily + on push).
- **v2.0** — README refreshed to match current code (8 leagues, book-odds/edge feature, verification workflow).
- **v2.0** — Value/edge calculation comparing book odds against fair odds.
- **v2.0** — All Fixtures view as the default landing page.
- **v2.0** — Eight competitions: PL, La Liga, Serie A, Bundesliga, Ligue 1, UCL, UEL, UECL.
