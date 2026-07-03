# Architecture

Mr. Fit is a client-only idle game. No backend, no accounts — everything runs and persists in the player's browser.

> **Status:** this document describes the codebase as it exists today — a generic currency/generator clicker. The project is mid-pivot to a bodyweight home-workout theme (`project/requirements.md`, v2); the exercise/fatigue system in `project/tickets.md` milestones M1–M2 isn't built yet. This page will be updated as that work lands, not before — see `docs/technical/adr/` for the decisions already made and still valid regardless of theme (Pinia, localStorage).

## Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **TypeScript**, strict, no `any`
- **Vite** for dev server and build
- **Pinia** for state management

## Folder layout

```
src/
├── main.ts               # app entry point, registers Pinia, mounts App
├── App.vue                # top-level layout: header, clicker button, generators/upgrades
├── style.css               # dark theme via CSS custom properties, layout utilities
├── types/
│   └── game.ts             # Generator, Upgrade, UpgradeEffect, GameState — the core data contracts
├── stores/
│   └── game.ts              # the single Pinia store: state, actions, persistence
├── composables/
│   └── useGameLoop.ts        # drives store.tick() on a real-time interval
├── utils/
│   └── numberFormat.ts        # large-number formatting (K/M/B/... suffixes)
└── components/
    ├── CurrencyDisplay.vue
    ├── ClickerButton.vue
    ├── GeneratorsList.vue / GeneratorItem.vue
    └── UpgradesList.vue / UpgradeItem.vue
```

## Data flow

1. `useGameLoop` fires on an interval (default 200ms) and calls `store.tick(deltaSeconds)` with the real elapsed time.
2. `tick` adds `totalProduction * deltaSeconds` to `currency`, where `totalProduction` is a computed sum over all generators' `baseProduction * owned`.
3. A manual click calls `store.click()`, which adds `clickPower` to `currency` and increments `totalClicks`.
4. Buying a generator or upgrade deducts currency and mutates the relevant array in place; upgrade effects are applied once, permanently, at purchase time (see `UpgradeEffect` in `types/game.ts`).
5. State changes trigger a debounced save to `localStorage` (key `mr-fit:game-save`). A full `GameState` snapshot is written, including `lastSavedAt`.
6. On store init, a saved state is loaded (with a type-guard validator so a corrupted/foreign value in localStorage doesn't crash the app) and offline progress is applied once: `min(now - lastSavedAt, OFFLINE_CAP) * totalProductionAtLoad`, added to `currency` before the UI renders.

## State shape

See `src/types/game.ts` for the authoritative types. In short: `GameState` is `{ currency, totalClicks, clickPower, generators: Generator[], upgrades: Upgrade[], lastSavedAt }`. Costs are derived, not stored: `cost = baseCost * costGrowth ** owned`.

## Why this shape

See the ADRs in `docs/technical/adr/` for the reasoning behind specific choices (state management library, persistence mechanism, etc.). This document describes the *current* architecture; ADRs describe *why* it ended up this way and what alternatives were considered.
