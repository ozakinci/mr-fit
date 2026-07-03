# Tickets

Actionable, independently-shippable work, ticket-numbered (`MRFIT-N`, assigned incrementally, never reused) and grouped into milestones. This is the primary backlog — supersedes the old checkbox-list `project/backlog.md`, which is now a pointer to this file. Owned by the project-manager agent.

Status values: `Open`, `In Progress`, `Done` (move done tickets to the bottom of their milestone rather than deleting them — the ticket number and its history stay).

Next free ticket number: **MRFIT-18**

---

## Milestone M1 — Core Fitness Loop — **COMPLETE**

Replace the old currency/generator loop with the exercise/rep/muscle model. Nothing else in the game makes sense until this lands. Shipped by main-dev as 5 micro-commits (`5cfdfc2`, `b9c4afb`, `1fde211`, `0c8a2ae`, `17bbfdf`); typecheck and build both pass. Test coverage not yet written — blocked on MRFIT-13.

### MRFIT-1 — Replace currency/generator data model with exercise categories
Push, Pull, Legs, Core replace the generic generator list. See `project/requirements.md` § Exercises.
**Status:** Done

### MRFIT-2 — Main click button logs 1 rep for every exercise at once
Each click of the main button (`MainRepButton.vue`) adds 1 rep to Push, Pull, Legs, and Core simultaneously — no exercise-selection UI or state.
**Status:** Done

### MRFIT-3 — Exercise buttons perform a full set in one click
`ExerciseButton.vue`/`ExercisesList.vue`: clicking an exercise applies its `repsPerSet` minimum in one action.
**Status:** Done

### MRFIT-4 — Track a "muscle" stat built from completed reps
Replaces "currency." Both `clickMain()` and `performSet()` route muscle gain through a `musclePerRep` computed, pre-wired for MRFIT-6's fatigue efficiency scaling to plug into without touching action logic.
**Status:** Done

### MRFIT-16 — Don't persist repsPerSet into saves
Found by code-reviewer during M1 review. `loadFromStorage()` replaces `exercises` wholesale from the save, including `repsPerSet` — so retuning the seed balancing numbers in `createInitialExercises()` only affects brand-new players, not returning ones, silently. Persist only mutable state (`reps`) and re-derive static config (`name`, `repsPerSet`) from the seed on load.
**Status:** Open

### MRFIT-17 — Harden save validation for exercise shape
Found by code-reviewer during M1 review. `isSavedGame` only checks `Array.isArray(v.exercises)`, not that each element has the right shape. A corrupted/tampered save loads successfully and then degrades to `NaN` in `reps`/`muscle`/`totalReps` instead of failing cleanly and falling back to a fresh game. Validate each element has `id`/numeric `reps`/`repsPerSet` before trusting it.
**Status:** Open

---

## Milestone M2 — Fatigue & Rest System

Depends on M1 (there's nothing to gate without a working exercise loop). Note: the user has flagged more fatigue-related requirements coming later — keep this system's surface area minimal and easy to extend rather than over-building now.

### MRFIT-5 — Add a fatigue meter (0–100%)
A single fatigue resource, starting at 0, rising as exercises are performed.
**Status:** Open

### MRFIT-6 — Scale set/rep efficiency down as fatigue rises
Muscle gained per rep/set decreases as fatigue increases, with a pronounced (non-linear) drop-off as fatigue approaches 100% — not just "somewhat less," clearly bad. Covers both "more fatigue = less efficient" and "build less muscle near 100%" from the source requirements.
**Status:** Open

### MRFIT-7 — Force rest state at 100% fatigue
When fatigue hits 100%, block the main click button and all exercise buttons. Injury/consequence mechanics are explicitly out of scope — just the hard stop.
**Status:** Open

### MRFIT-8 — Auto-resume from rest below 20% fatigue
Fatigue passively decreases during rest; once it drops below 20%, exercise actions unblock automatically (no manual "resume" action needed).
**Status:** Open

---

## Milestone M3 — Open-Source Housekeeping

Carried over unchanged from the pre-pivot backlog — not gameplay, still relevant regardless of game theme, not blocked on M1/M2.

### MRFIT-9 — Choose and add a LICENSE
Blocked on a decision from the project owner (see `project/requirements.md`'s open questions in prior versions / project owner input). MIT is the common default for a small hobby game but it's their call.
**Status:** Open

### MRFIT-10 — Add CI (typecheck + build on PRs)
So external contributors get automatic feedback.
**Status:** Open

### MRFIT-11 — Decide public hosting
GitHub Pages, Vercel, Netlify, or nothing yet. Affects whether player-facing docs point at a URL or just local dev instructions.
**Status:** Open

### MRFIT-13 — Add a unit/integration test framework
main-dev's agent definition now requires unit tests (full coverage) and functional/integration tests on every commit, but no test runner is installed (`package.json` has none — no Vitest, no Jest). That requirement isn't actionable until a framework is chosen and wired up (config, `npm test` script, CI hook once MRFIT-10 exists). Flagged during the git-hooks work in MRFIT-12; needs a decision from the project owner or main-dev, not decided here.
**Status:** Open

### MRFIT-12 — Wire up git hooks for the updated agent workflow
Enforce a ticket ID (`MRFIT-N`) in every commit message (`commit-msg`, blocking). Auto-trigger code-reviewer (opus) and tester (external Playwright coverage, left uncommitted for review) in the background after every commit (`post-commit`, non-blocking), per main-dev/code-reviewer/tester's updated "after each commit" instructions. See `AGENTS.md` for the mechanism, cost implications, and how to disable. Enabled via `git config core.hooksPath .githooks` in this repo, done with explicit sign-off (Claude Code's own permission layer flagged enabling a standing agent-spawning mechanism and required confirmation before proceeding).
**Status:** Done

### MRFIT-14 — Make project-manager the owner's sole point of contact and orchestrator
Expanded `.claude/agents/project-manager.md`: the project owner talks only to project-manager, never addresses main-dev/tester/documenter/technical-documenter/code-reviewer directly; project-manager is accountable for chasing tickets to real end-to-end completion (code + tests + docs + review), not just writing them down. Also added a tone/personality directive (blunt, funny, occasional mild cursing, pushes back on vague requests) per the project owner's request. Note: granting project-manager the `Agent` tool itself (needed for it to spawn other subagents autonomously) was blocked by Claude Code's permission layer as a self-authorized capability expansion — still needs explicit sign-off from the project owner, tracked as a follow-up rather than blocking this ticket.
**Status:** Done

### MRFIT-15 — Shared continuity log across all agents
Added `project/agent-log.md`: every agent reads it at the start of work and appends a short entry after every change (3-day retention, oldest day pruned on append), so work stays coherent across a session restart or token reset. `code-reviewer` can't write it directly (read-only by design) — it appends a `LOG:` line to its report for the invoker to relay instead. `main-dev`/`documenter`/`technical-documenter`/`tester` each got a narrow, explicit exception to write *only* this one file outside their normal domain (`tester` especially, since it otherwise never touches the main repo).
**Status:** Done

---

## Deferred (not ticketed yet)

Ideas from the pre-pivot backlog that are still plausible but shouldn't be ticketed until their shape under the new fitness theme is clearer:

- **Reset-save action, save export/import, mobile-responsive layout** — theme-agnostic, likely still wanted; re-ticket once M1/M2 land and the new UI's actual shape is known. M1 has now landed.
- **Prestige/rebirth, achievements, sound/juice, "more content"** — designed for the old abstract-currency frame. Revisit the *concept*, not just the ticket, once the fitness core loop exists (e.g. "prestige" might become "start a new training program" or something else entirely — that's a design decision for later, not a rename to do now). M1 has now landed.
- **Upgrades equivalent** — the old one-time-purchase upgrades system was removed wholesale in M1 (out of v2.1 requirements scope, not a straight port). If the fitness theme wants an equivalent progression mechanic later (equipment unlocks? form/technique upgrades?), that's a fresh design decision, not a resurrection of `Upgrade`/`UpgradeEffect`. Flagged by main-dev, not yet needed.
