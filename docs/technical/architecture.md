# Architecture

Mr. Fit is a client-only idle game. No backend, no accounts — everything runs and persists in the player's browser.

## Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **TypeScript**, strict, no `any`
- **Vite** for dev server and build
- **Pinia** for state management

## Folder layout

```
src/
├── main.ts                  # app entry point, registers Pinia, mounts App
├── App.vue                  # top-level layout: header (muscle display), main rep button, exercises list
├── style.css                 # dark theme via CSS custom properties, layout utilities
├── types/
│   └── game.ts                # Exercise, ExerciseId, GameState — the core data contracts
├── stores/
│   └── game.ts                 # the single Pinia store: state, actions, persistence
├── composables/
│   └── useGameLoop.ts           # setInterval-driven tick helper — currently unused (see below)
├── utils/
│   └── numberFormat.ts           # large-number formatting (K/M/B/... suffixes)
└── components/
    ├── MuscleDisplay.vue           # shows current muscle total and lifetime reps
    ├── MainRepButton.vue           # the universal "do a rep" button
    ├── ExercisesList.vue           # renders one ExerciseButton per exercise
    └── ExerciseButton.vue          # one exercise's "do a set" button
```

There is no `upgrades` concept in the current model — the v1 `UpgradeItem`/`UpgradesList` components and their store state were removed in Milestone M1 (see ADR 0004).

`useGameLoop` is still present but not imported anywhere right now: nothing in the current exercise/rep/muscle model produces value passively, so there's no tick to drive. It's kept in place because Milestone M2 (fatigue & rest, see `project/roadmap.md`) is expected to need an interval-driven recovery tick while the player is resting; treat it as reserved, not dead code to delete on sight.

## Data flow

1. The main button (`MainRepButton`) calls `store.clickMain()`, which logs **1 rep on every exercise category at once** (Push, Pull, Legs, Core — there is no "selected exercise" state) and, for each of those reps, adds `musclePerRep` to `muscle`. It also increments `totalClicks`.
2. Each exercise's own button (`ExerciseButton`, rendered by `ExercisesList`) calls `store.performSet(id)`, which adds that one exercise's `repsPerSet` reps in a single action (and `musclePerRep * repsPerSet` muscle). Sets are free actions — there is no cost or affordability check, unlike v1's generator purchases.
3. `musclePerRep` is a computed: `BASE_MUSCLE_PER_REP * efficiency`, where `efficiency` is currently hardcoded to `1`. Both actions already route muscle gain through this computed so that Milestone M2's fatigue system (MRFIT-6) can make `efficiency` fall as fatigue rises without touching `clickMain`/`performSet` themselves.
4. State changes trigger a debounced save to `localStorage` (key `mr-fit:game-save`, unchanged from v1 — see ADR 0003), plus a periodic autosave and a `beforeunload` save. A full `GameState` snapshot is written, including `lastSavedAt`.
5. On store init, a saved state is loaded (validated through a type-guard so a corrupted/foreign value in localStorage doesn't crash the app) and applied directly. Unlike v1, there is **no offline-progress calculation**: nothing in this model produces muscle passively, so there's nothing to catch up on between sessions. (This may return if/when M2 introduces passive fatigue recovery during rest.)

## State shape

See `src/types/game.ts` for the authoritative types. In short:

```ts
GameState = {
  muscle: number          // core resource, replaces v1's "currency"
  totalClicks: number     // lifetime main-button clicks
  exercises: Exercise[]   // the four launch categories
  lastSavedAt: number
}

Exercise = {
  id: ExerciseId           // 'push' | 'pull' | 'legs' | 'core'
  name: string
  reps: number             // lifetime reps completed for this exercise
  repsPerSet: number       // reps applied by one "do a set" click; a fixed balancing number, not something the player buys more of
}
```

There's no derived-cost math here (v1's `cost = baseCost * costGrowth ** owned` is gone along with generators) — `repsPerSet` is a static seed value per exercise, not a purchasable quantity.

## Why this shape

See the ADRs in `docs/technical/adr/` for the reasoning behind specific choices (state management library, persistence mechanism, the v2 data model itself, etc.). This document describes the *current* architecture; ADRs describe *why* it ended up this way and what alternatives were considered.
