# 3. Use localStorage for save persistence

## Status

Accepted

## Context

Player progress (currency, generators, upgrades, timestamps) needs to survive a page reload and a closed browser tab, with no backend or account system (see `project/requirements.md` non-goals).

## Decision

Persist the full `GameState` as JSON to `localStorage` under the key `mr-fit:game-save`. Saves are debounced after mutating actions (click/buy) plus a periodic autosave and a `beforeunload` save. On load, the saved value is parsed through a type-guard validator before being trusted, so a corrupted or foreign value doesn't crash the app — it's treated as "no save."

Alternatives considered:

- **IndexedDB**: better suited to large or relational data; overkill for a small flat JSON blob like this game's state. Revisit if save data grows substantially (e.g. long purchase history logs).
- **Cookies**: size-limited and sent on every HTTP request, neither of which is relevant here since there's no server — no reason to pay that cost.

## Consequences

- Save data is tied to one browser on one device; there's no cross-device sync. Save export/import (copy a save-code, paste it elsewhere) is on the backlog as a partial mitigation.
- localStorage is synchronous, which is fine at this data size but would need revisiting if `GameState` grows large enough to cause jank on save/load.
- Offline-progress calculation depends on `lastSavedAt` being trustworthy — a player manually editing localStorage can grant themselves currency. Accepted as a non-issue for a single-player, no-stakes idle game.
