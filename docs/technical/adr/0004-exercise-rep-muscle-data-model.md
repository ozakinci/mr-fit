# 4. Replace the currency/generator/upgrade model with an exercise/rep/muscle model

## Status

Accepted

## Context

Mr. Fit shipped its first playable slice as a generic incremental-clicker: an abstract `currency` earned by clicking and by passively-producing `Generator`s, spent on one-time `Upgrade`s that permanently modified production. `project/requirements.md` was then pivoted to v2 — a bodyweight home-workout theme — which reframes the core loop around doing reps of real exercise categories (Push, Pull, Legs, Core) rather than buying abstract production. Milestone M1 (`project/tickets.md`, tickets MRFIT-1 through MRFIT-4) was the ticket group that made the data model match that theme.

The old contracts (`Generator`, `Upgrade`, `UpgradeEffect` in `src/types/game.ts`) don't have a sensible mapping onto "categories of bodyweight exercise" — a generator is something you buy more of to passively produce currency over time, and nothing in the new theme produces anything passively. Retrofitting the theme onto the old shape would have meant keeping dead concepts (purchase cost curves, passive production, permanent one-time-purchase modifiers) that no longer correspond to anything a player does.

## Decision

Replace the data model wholesale rather than adapt it incrementally:

- `GameState` is now `{ muscle, totalClicks, exercises: Exercise[], lastSavedAt }`, replacing `{ currency, totalClicks, clickPower, generators, upgrades, lastSavedAt }`.
- `Exercise` (`{ id, name, reps, repsPerSet }`, four fixed instances — Push/Pull/Legs/Core) replaces `Generator`. There is no "owned count" or purchase cost: `repsPerSet` is a static per-exercise balancing constant, and reps accumulate by being performed, not bought.
- `muscle` (built from completed reps via a `musclePerRep` computed) replaces `currency` as the core resource.
- The **upgrades system was removed entirely** — `Upgrade`, `UpgradeEffect`, `UpgradeItem.vue`, `UpgradesList.vue` are all deleted, not ported. One-time permanent production multipliers don't correspond to anything in the reps/muscle model as currently specified in requirements v2.1, and no replacement mechanic was in scope for M1. If the fitness theme wants an equivalent progression system later (equipment unlocks, form/technique upgrades, etc.), that's a fresh design decision against the new theme, not a resurrection of the old types — see `project/tickets.md`'s Deferred section.
- Components were renamed to match the new domain: `ClickerButton` → `MainRepButton`, `GeneratorItem`/`GeneratorsList` → `ExerciseButton`/`ExercisesList`, `CurrencyDisplay` → `MuscleDisplay`.
- Passive production (and with it, `useGameLoop`'s tick-driven `store.tick()` call and the offline-progress-on-load calculation) was dropped: nothing in this model produces value while the player isn't actively clicking. `useGameLoop.ts` itself was left in place, unused, since Milestone M2 (fatigue & rest) is expected to need an interval-driven tick again for passive fatigue recovery during rest — see `project/roadmap.md`.
- Muscle gain in both new actions (`clickMain`, `performSet`) routes through a `musclePerRep` computed (`BASE_MUSCLE_PER_REP * efficiency`), with `efficiency` hardcoded to `1` for now. This is a deliberate seam: MRFIT-6 (M2) will make `efficiency` fall as a forthcoming fatigue stat rises, without either action's logic needing to change.

Alternatives considered:

- **Keep `Generator`/`Upgrade` and reinterpret them thematically** (e.g. "generator" = exercise, "owned count" = some proficiency stat): rejected — passive production and purchase costs don't map onto "perform a set of pull-ups," and forcing the fit would leave confusing vestigial fields (`baseCost`, `costGrowth`) with no meaning in the new theme.
- **Add exercises alongside the existing generator model rather than replacing it**: rejected — v2.1 requirements don't call for a dual-resource game, and running both models in parallel would double the surface area for no player-facing benefit.

## Consequences

- The type contracts and store are now honest about what the game actually does — no dead fields left over from the currency-clicker frame.
- Any documentation, save data, or external tooling written against the v1 shape (`currency`, `generators`, `upgrades`) is incompatible. There is no migration path: existing localStorage saves under `mr-fit:game-save` fail the `isSavedGame` type guard and are treated as "no save" (silently discarded, not upgraded) — acceptable pre-open-source-release with no real player base yet, but would need a real migration strategy if this happened post-release.
- `useGameLoop.ts` is currently dead code by usage (nothing imports it). It's being kept rather than deleted on the bet that M2 needs it; if M2 lands and doesn't end up needing an interval tick, it should be removed then rather than lingering indefinitely.
- Upgrades are gone with no replacement yet. Anything in `project/requirements.md` or elsewhere that still assumes an upgrade/progression purchase system is stale until a new mechanic is designed for the fitness theme.
