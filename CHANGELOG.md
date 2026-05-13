# Changelog

`YYYY-MM-DD HH:MM BST`, AI Name (Tool), Short description of change and why, including primary file(s) in backticks.

All notable changes to this repository are documented here — **newest first**. Use **BST** for the changelog so it stays aligned with `index.html` topbar timings.

| Date · time (BST) | AI Name | Changed |
|---|---|---|
| 2026-05-13 23:05 | Gemini (Antigravity) | Modified `scripts/fetch-fixtures.js` to strictly use the official API `name` without any custom string cleaning, adhering to "API names are LAW". Manually fetched 51 fixtures to populate staging environment. Bumped to `v2.21`. |
| 2026-05-13 22:45 | Gemini (Antigravity) | Removed hardcoded fixtures from index.html to transition to API-only via GitHub Actions (`index.html`). Bumped topbar to `v2.20`. |
| 2026-05-10 20:54 | Codex 5.3 | Added aligned fixture-list headings for Fixture, League, Research, Draw Probability, and Draw Signal; tightened table width, improved expanded-panel wrapping, and raised small text sizes for readability (`index.html`). Pending topbar bump to `v2.15`, **FEATURES.md** Done. |
| 2026-05-10 20:26 | Codex 5.3 | Updated verdict colours to a traffic-light scale: Low red, Moderate amber, Good green, Strong blue; percentage text and mini-bars now match (`index.html`). Bumped `index.html` to `v2.14`, **FEATURES.md** Done. |
| 2026-05-10 19:05 | Codex 5.3 (Cursor) | Changelog datetime column includes **time** (`YYYY-MM-DD HH:MM BST`); updated docs to match (`AGENTS.md`, `README.md`, `FEATURES.md`). Bumped `index.html` to `v2.13`, **FEATURES.md** Done. |
| 2026-05-10 18:45 | Codex 5.3 (Cursor) | Reformatted `CHANGELOG.md`: column spec line at top; table **newest-first**; prepend workflow in `AGENTS.md`, `README.md`, `FEATURES.md`. Bumped app to `v2.12` in `index.html`; added **v2.12** in `FEATURES.md`. |
| 2026-05-10 18:39 | Codex 5.3 (Cursor) | Replaced `CLAUDE.md` with read-first `AGENTS.md` for multi-AI use and updated `README.md`/`FEATURES.md` to require `CHANGELOG.md` in the edit workflow. |
| 2026-05-10 18:31 | Codex 5.3 (Cursor) | Updated `Fair draw odds` label to white for readability and changed `--text3` from `#444` to `#fff` in `index.html`. |

## Cross-AI editing notes

- Prepend **one new row** directly under the table header (above older rows).
- Same-day entries: newest session first; use finer ordering by **time** when needed.
- Run `git status` and `git pull --rebase` before editing.
