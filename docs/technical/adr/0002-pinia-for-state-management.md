# 2. Use Pinia for game state management

## Status

Accepted

## Context

The game needs a single source of truth for currency, generators, upgrades, and click power, shared across several components (`ClickerButton`, `CurrencyDisplay`, `GeneratorsList`, `UpgradesList`) with no natural parent-child relationship between them that would make prop-drilling clean.

## Decision

Use Pinia, with a single Composition-API store (`src/stores/game.ts`) as the source of truth for all game state. Components import `useGameStore()` directly rather than receiving state via props.

Alternatives considered:

- **A plain reactive object exported from a module**: works for a project this small, but forgoes Vue devtools integration, and would need to be hand-rolled for anything Pinia already provides for free.
- **Prop drilling from `App.vue`**: doesn't scale past a couple of components without introducing an ad hoc event bus, which is more code than just using Pinia.

## Consequences

- Any component can read or mutate game state without explicit wiring through parents — convenient for a small app, but means state mutations aren't always visible at the call site. Keep mutating logic (buy/click/tick) inside store actions, not scattered across components, to preserve a single place to reason about state changes.
- Pinia is a new dependency (`pinia`), but a small and standard one for Vue 3 projects.
