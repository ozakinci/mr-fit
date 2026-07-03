# Contributing to Mr. Fit

Mr. Fit is a bodyweight home-workout idle game (Vue 3 + TypeScript + Vite + Pinia). Its core loop was rewritten from an earlier generic-currency clicker to the current exercise/rep/muscle model in Milestone M1 — see [`project/requirements.md`](project/requirements.md) for the version history and [`project/tickets.md`](project/tickets.md) for what's landed vs. pending. Contributions welcome.

## Getting set up

```
npm install
npm run dev       # starts the dev server at http://localhost:5173
```

Before opening a PR, make sure both of these pass:

```
npx vue-tsc --noEmit -p tsconfig.app.json   # typecheck
npm run build                                 # production build
```

## Project layout

See [`docs/technical/architecture.md`](docs/technical/architecture.md) for how the code is organized and how data flows through the app. Significant past decisions (and why) are recorded in [`docs/technical/adr/`](docs/technical/adr/).

## Coding conventions

- Composition API, `<script setup lang="ts">`, no `any`.
- Match existing folder conventions: stores in `src/stores/`, shared types in `src/types/`, presentational components in `src/components/`, utilities in `src/utils/`, composables in `src/composables/`.
- Keep game-state mutations inside Pinia store actions, not scattered across components.

## Commit conventions

This repo's hooks live in [`.githooks/`](.githooks/) and are tracked in git, but `core.hooksPath` itself is a local git config setting — it does **not** travel with a clone. After cloning, run this once:

```
git config core.hooksPath .githooks
```

That enables:

- **`commit-msg`** (blocking, free, no agent involved) — every commit message must reference a ticket ID (`MRFIT-N` — see [`project/tickets.md`](project/tickets.md)). No ticket that fits? Open one, or use `git commit --no-verify` for a genuine exception.
- **`post-commit`** (background, non-blocking) — an independent review (Opus) and draft external test coverage are generated automatically after each commit — see [`AGENTS.md`](AGENTS.md#commit-conventions-enforced) for the mechanism, its cost (real API usage per commit), and how to opt out per-commit or entirely. Requires the `claude` CLI on your `PATH`; a plain VSCode-extension install won't trigger it.

Prefer small, single-functionality commits over large ones either way.

## Proposing changes

- Small fixes: open a PR directly.
- Larger changes (new mechanics, architectural changes): open an issue or discussion first, referencing [`project/requirements.md`](project/requirements.md) (versioned — check you're reading the current version) and [`project/tickets.md`](project/tickets.md) so the change lines up with where the project is headed.
- If your change involves a genuinely hard-to-reverse technical decision, add an ADR under `docs/technical/adr/` (see `0001-record-architecture-decisions.md` for the format) rather than just describing it in the PR.

## This repo uses a multi-agent Claude Code workflow

If you use [Claude Code](https://claude.com/claude-code), this repo defines six project-scoped subagents under [`.claude/agents/`](.claude/agents/) — a project manager, a developer, an independent QA tester (in a separate sibling project), a player-facing documenter, a technical documenter, and a code reviewer running on a stronger model. See [`AGENTS.md`](AGENTS.md) for what each one owns and how they hand off work. You don't need Claude Code to contribute — this is optional tooling, not a requirement.

## Code of conduct

Be respectful. Assume good faith. This is a hobby project — keep it fun.

## License

Mr. Fit is [MIT licensed](LICENSE). By contributing, you agree your contributions are licensed under the same terms.
