# Mr. Fit

A bodyweight home-workout idle game. Vue 3 (Composition API, `<script setup lang="ts">`) + TypeScript + Vite + Pinia. Client-only, no backend — state persists to `localStorage`. The pivot from an earlier generic-currency clicker landed in Milestone M1: click the main button to rep every exercise (Push/Pull/Legs/Core) at once, click an exercise's own button for a full set, reps build a `muscle` stat. M2 (fatigue/rest) is next, not yet built. See `project/requirements.md` (versioned; check the current version number and Version History) and `project/tickets.md` for what's actually landed vs. still pending.

**Before doing anything else, read [`project/agent-log.md`](project/agent-log.md).** This applies to you even if you're the main session, not a subagent — it's the mechanism that keeps work coherent across a session restart, a token reset, or a completely different machine, all of which wipe conversation history but not this file. Append a short entry after any change you make, same as the subagents do (see each `.claude/agents/*.md` for the per-agent format and the 3-day retention rule).

## Multi-agent workflow

This repo is developed with six project-scoped subagents defined in `.claude/agents/`, each owning a distinct slice of the project. See [`AGENTS.md`](AGENTS.md) for the full map (ownership table, handoff order, how to invoke each one). In short:

- `project-manager` — `project/` (versioned requirements, ticket-numbered backlog, roadmap)
- `main-dev` — `src/**`, application code
- `tester` — a *separate* sibling project (`../mr-fit-tester`), black-box E2E testing
- `documenter` — `docs/*.md`, player-facing only
- `technical-documenter` — `docs/technical/`, `CONTRIBUTING.md`
- `code-reviewer` — read-only, runs on Opus, independent review

Stay inside your agent's domain (see that agent's file for specifics) rather than reaching into another's — that separation is intentional, not accidental scope-narrowing.

## Conventions

- No `any`. Strict TypeScript throughout.
- Stores in `src/stores/` (Pinia, Composition API style), shared types in `src/types/`, components in `src/components/` (one per file), utilities in `src/utils/`, composables in `src/composables/`.
- Before considering a change done: `npx vue-tsc --noEmit -p tsconfig.app.json` and `npm run build` both pass.
- Game-balance numbers (rep values, `musclePerRep`/`efficiency`) should keep progress feeling immediate early on; once M2 lands, fatigue should meaningfully discourage grinding without feeling punishing.

## License

MIT (see [`LICENSE`](LICENSE)). Contributions are made under the same terms — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Not yet decided

See `project/requirements.md`'s Open Questions section for undecided design points (e.g. what "per day" means for the fatigue budget, whether fatigue recovers passively outside forced rest) and `project/tickets.md` M3 for open housekeeping (CI, hosting).
