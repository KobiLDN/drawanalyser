# Conventions for this repo

These apply to every change Claude makes. They are also a useful reference for any human contributor.

## After every edit

When you commit a change, also update **all three** of these in the same commit:

1. **`index.html` topbar** — bump the version by `0.1` (e.g. `v2.3 → v2.4`) and refresh the `Updated <date> <time> BST` tag. Both live on the topbar around line 248.
2. **`FEATURES.md`** — add an entry in the **Done** section under the new version. If the change came from the Backlog, remove the matching item.
3. **`README.md`** — only update if the change is user-visible or affects how to develop, deploy, or use the site. Process-only changes can skip the README.

## Version scheme

- The whole tool is on the v2 line (the 2025–26 season build).
- Every commit landed on `main` increments the minor version by 0.1: `v2.0 → v2.1 → v2.2 → ...`
- After `v2.9` comes `v2.10`, then `v2.11`, etc. Don't reset.
- Reserve `v3` for a major redesign or a season rollover.

## Branching & merging

- Develop on `claude/grant-repo-access-a3MvD` (the proxy in this session can't push directly to `main`).
- Land changes on `main` by opening a PR via the GitHub API and squash-merging — the auto-merge flow is fully hands-off.
- Force-push the working branch only with `--force-with-lease` when needed; never to `main`.

## Sensitive data

- API keys go in repo secrets (Settings → Secrets → Actions), never in committed files.
- The `FOOTBALL_DATA_API_KEY` secret powers the fixture verification workflow.

## Style

- Match the existing dark theme (variables in `:root` at the top of `index.html`).
- Default to no comments unless the why is non-obvious.
- Keep commits focused — one logical change per commit.
