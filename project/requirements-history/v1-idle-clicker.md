> **Archived 2026-07-03.** Superseded by v2 (fitness/home-workout pivot). See
> `project/requirements.md` for current requirements and its Version History
> section for what changed and why. Preserved verbatim below for reference —
> never edited after archiving.

---

# Requirements

What Mr. Fit needs to do, by feature area. Owned by the project-manager agent — keep this in sync with what's actually built, not what's aspirational (that belongs in `roadmap.md`).

## Core loop

- The player clicks a button to earn currency (`clickPower` per click).
- Currency accumulates automatically over time from owned generators (currency/sec).
- Generators are purchasable, repeatable, and each purchase raises the cost of the next one.
- Upgrades are one-time purchases that permanently boost click power or generator production.

## Persistence

- Game state saves to `localStorage` automatically (on purchase/click, and periodically).
- Progress survives a page reload with no player action required.
- Closing the game and coming back later grants "offline progress": currency the player would have earned while away, capped at a maximum duration so it can't be gamed by leaving the tab open for days.

## UI

- Current currency and currency/sec are always visible.
- Generators and upgrades are listed with their cost, effect, and a buy button that's disabled when unaffordable.
- The game is playable in a normal desktop browser window; mobile/responsive layout is not yet a hard requirement (see `roadmap.md`).

## Non-goals (for now)

- No multiplayer, no server, no accounts. Everything is client-side and local to the browser.
- No monetization.
