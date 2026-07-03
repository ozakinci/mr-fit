# Tickets

Actionable, independently-shippable work, ticket-numbered (`MRFIT-N`, assigned incrementally, never reused) and grouped into milestones. This is the primary backlog — supersedes the old checkbox-list `project/backlog.md`, which is now a pointer to this file. Owned by the project-manager agent.

Status values: `Open`, `In Progress`, `Done` (move done tickets to the bottom of their milestone rather than deleting them — the ticket number and its history stay).

Next free ticket number: **MRFIT-12**

---

## Milestone M1 — Core Fitness Loop

Replace the old currency/generator loop with the exercise/rep/muscle model. Nothing else in the game makes sense until this lands.

### MRFIT-1 — Replace currency/generator data model with exercise categories
Push, Pull, Legs, Core replace the generic generator list. See `project/requirements.md` § Exercises.
**Status:** Open

### MRFIT-2 — Main click button logs one rep for the active exercise
See `project/requirements.md` § Reps and sets. **Blocked on Open Question 1** (how the main button relates to exercise selection) — needs a decision before or during implementation.
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

---

## Deferred (not ticketed yet)

Ideas from the pre-pivot backlog that are still plausible but shouldn't be ticketed until their shape under the new fitness theme is clearer:

- **Reset-save action, save export/import, mobile-responsive layout** — theme-agnostic, likely still wanted; re-ticket once M1/M2 land and the new UI's actual shape is known.
- **Prestige/rebirth, achievements, sound/juice, "more content"** — designed for the old abstract-currency frame. Revisit the *concept*, not just the ticket, once the fitness core loop exists (e.g. "prestige" might become "start a new training program" or something else entirely — that's a design decision for later, not a rename to do now).
