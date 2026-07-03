# Roadmap

Milestone sequencing. No dates — this is a hobby/OSS project. Tickets live in [`project/tickets.md`](tickets.md); this file just orders the milestones and gives the one-line "why now." Owned by the project-manager agent.

## M1 — Core Fitness Loop — **COMPLETE**

The v1 currency/generator loop has been replaced by the exercise/rep/muscle model described in `project/requirements.md`. Tickets MRFIT-1 through MRFIT-4 all shipped. Typecheck/build pass; test coverage still blocked on MRFIT-13.

## M2 — Fatigue & Rest System (current)

Depends on M1, which is now done — this is next. Adds the fatigue meter, efficiency scaling, and the forced-rest/auto-resume cycle. Tickets: MRFIT-5 through MRFIT-8. Expect more requirements to layer onto fatigue later (the user has flagged this explicitly) — build the minimal version described in requirements v2, not a speculative larger system. Note: main-dev's store already routes muscle gain through a `musclePerRep` computed specifically so MRFIT-6 can plug efficiency scaling in without touching `clickMain()`/`performSet()` — check that before redesigning the flow.

## M3 — Open-Source Housekeeping

Independent of M1/M2 — can happen in parallel or whenever there's a lull. License, CI, hosting. Tickets: MRFIT-9 through MRFIT-11.

## Later (not yet milestoned)

See "Deferred" in `project/tickets.md`: save/export/import, mobile layout, and reconsidering prestige/achievements/sound under the new fitness theme once M1/M2 exist to react to.

Milestones are sequential in intent for M1 → M2 (real dependency), not strict gates otherwise — M3 can be picked up any time.
