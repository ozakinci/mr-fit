# Tickets

Actionable, independently-shippable work, ticket-numbered (`MRFIT-N`, assigned incrementally, never reused) and grouped into milestones. This is the primary backlog — supersedes the old checkbox-list `project/backlog.md`, which is now a pointer to this file. Owned by the project-manager agent.

Status values: `Open`, `In Progress`, `Done` (move done tickets to the bottom of their milestone rather than deleting them — the ticket number and its history stay).

Next free ticket number: **MRFIT-16**

---

## Milestone M1 — Core Fitness Loop

Replace the old currency/generator loop with the exercise/rep/muscle model. Nothing else in the game makes sense until this lands.

### MRFIT-1 — Replace currency/generator data model with exercise categories
Push, Pull, Legs, Core replace the generic generator list. See `project/requirements.md` § Exercises.
**Status:** Open

### MRFIT-2 — Main click button logs 1 rep for every exercise at once
Unblocked. Each click of the main button adds 1 rep to Push, Pull, Legs, and Core simultaneously — no exercise-selection UI or state needed. See `project/requirements.md` § Reps and sets (resolved in v2.1).
**Status:** Open

### MRFIT-3 — Exercise buttons perform a full set in one click
Clicking a Push/Pull/Legs/Core button applies that exercise's minimum rep count in one action.
**Status:** Open

### MRFIT-4 — Track a "muscle" stat built from completed reps
Replaces "currency" as the core resource. Muscle-per-rep is a rate to be modulated by fatigue efficiency (MRFIT-6), not flat.
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

- **Reset-save action, save export/import, mobile-responsive layout** — theme-agnostic, likely still wanted; re-ticket once M1/M2 land and the new UI's actual shape is known.
- **Prestige/rebirth, achievements, sound/juice, "more content"** — designed for the old abstract-currency frame. Revisit the *concept*, not just the ticket, once the fitness core loop exists (e.g. "prestige" might become "start a new training program" or something else entirely — that's a design decision for later, not a rename to do now).
