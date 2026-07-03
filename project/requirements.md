# Requirements

**Current version: 2.1** — see [Version History](#version-history) at the end for what changed and why. Whole-number bumps (v1 → v2) are full pivots, archived verbatim under `project/requirements-history/`; point bumps (2 → 2.1) are clarifications of open questions within the current pivot and aren't separately archived — the Version History entry is the record.

Owned by the project-manager agent — keep this in sync with what's actually built, not what's aspirational (that belongs in `project/roadmap.md`). Actionable work derived from this document lives in `project/tickets.md`.

## Premise

The player is out of shape and wants to start working out at home, with no equipment. Mr. Fit is a bodyweight home-workout idle/incremental game: the player performs exercises by clicking, builds muscle over time, and has to manage fatigue so they don't overtrain.

## Exercises

- Four basic bodyweight exercise categories at launch: **Push**, **Pull**, **Legs**, **Core**.
- All exercises are bodyweight-only — no equipment, ever, for this initial set. (Equipment-based exercises are out of scope unless a future requirement says otherwise.)
- Each exercise category has its own button in the UI.

## Reps and sets

- The **main click button** counts as a rep: each click logs **1 rep for every available exercise simultaneously** — Push, Pull, Legs, and Core all gain a rep from the same click. There is no "selected" or "active" exercise; the main button is universal, not per-category.
- Clicking an **exercise category button** performs a full **set**: one click applies a minimum number of reps for *that* exercise only, in one action, rather than requiring that many individual clicks.

## Muscle

- Completed reps build a **muscle** stat — this replaces "currency" as the core resource from v1.
- Muscle gained per rep/set is scaled by **efficiency**, which depends on current fatigue (see below), not a flat rate.

## Fatigue

- The player has a **fatigue** level, framed as a budget (0–100%).
- Doing exercises raises fatigue.
- **Efficiency drops as fatigue rises**: the higher the fatigue, the less muscle a set/rep produces. This drop-off is not linear — it should be pronounced as fatigue approaches 100%, so grinding through near-max fatigue is clearly a bad trade, not just a mildly worse one.
- At **100% fatigue**, the player is forced to **rest**: exercise actions (main click button and exercise buttons) are blocked until fatigue recovers.
- During rest, fatigue passively decreases. Rest ends automatically — and exercise actions unblock — once fatigue drops **below 20%**.
- Injury prevention and consequences of ignoring fatigue are explicitly **out of scope for now** — planned for a future requirements batch.
- The "per day" framing for the fatigue budget is noted but not yet specified (see Open Questions) — don't build a day-boundary/daily-reset mechanic yet.

## Non-goals (for now)

- No multiplayer, no server, no accounts. Everything is client-side and local to the browser.
- No monetization.
- No equipment-based exercises.
- No injury mechanics yet.

## Open Questions

These need a decision (from the project owner or main-dev, as appropriate) before or during implementation — not silently assumed:

1. ~~How does the main click button relate to the exercise buttons?~~ **Resolved 2026-07-03:** the main button is universal — one click grants 1 rep to *all* exercises at once. No selection state. See § Reps and sets.
2. **What does "per day" mean for the fatigue budget?** A visual framing only for now, or does fatigue actually reset/refill on a real-world day boundary? Deferred until a future requirements batch per the user's note — flagged here so it isn't accidentally built early.
3. **Does fatigue decrease only during forced rest, or does it also passively recover during normal play (just slower)?** Only "rest until below 20%" is specified so far.

## Version History

### v2.1 — 2026-07-03 — Resolved: main button applies to all exercises

Answered Open Question 1: the main click button is universal, granting 1 rep to every exercise category per click, not tied to a "selected" exercise. Unblocks MRFIT-2. No prior content superseded — this fills in a gap v2 explicitly left open, not a pivot.

### v2 — 2026-07-03 — Pivot to home-workout fitness game

Replaced the generic "currency + generators" idle clicker with a fitness-themed one: the player is an out-of-shape person starting a bodyweight home workout routine. Currency becomes **muscle**; generators become **exercise categories** (Push/Pull/Legs/Core); a new **fatigue** budget gates play and forces rest at 100%, recovering until below 20%. Full v1 content archived at `project/requirements-history/v1-idle-clicker.md`.

### v1 — 2026-07-03 — Initial idle clicker concept

Generic currency-clicker: click for currency, buy generators or upgrades that produce it automatically, save/load with offline progress. Superseded by v2. Archived at `project/requirements-history/v1-idle-clicker.md`.
