# 1. Record architecture decisions

## Status

Accepted

## Context

Mr. Fit is headed toward open-source release. Contributors joining later will run into decisions ("why Pinia and not a plain reactive object," "why localStorage and not IndexedDB") with no context for why they were made. Without a record, either the reasoning gets re-litigated every time someone asks, or — worse — silently reversed by someone who didn't know why it was there in the first place.

## Decision

We record significant, hard-to-reverse architectural decisions as Architecture Decision Records (ADRs) in `docs/technical/adr/`, one file per decision, numbered sequentially.

Each ADR has:

- A **title**: a short noun phrase describing the decision (not the problem).
- A **status**: `proposed`, `accepted`, or `superseded` (with a link to the superseding ADR).
- **Context**: what circumstance/problem prompted the decision.
- **Decision**: what we're doing.
- **Consequences**: what becomes easier or harder as a result, including tradeoffs we accepted.

Once an ADR is `accepted`, it is never edited to change the decision — a new ADR supersedes it instead, so the log stays an accurate history rather than a rewritten one.

Not every choice needs an ADR. Use judgment: a new npm dependency, a changed data model, or a new persistence mechanism warrants one; a component's internal prop naming does not.

## Consequences

- New contributors can read `docs/technical/adr/` to understand why the codebase looks the way it does, instead of asking or guessing.
- Decisions take slightly longer to make "official" (writing a short ADR), in exchange for not having to re-explain them later.
- The technical-documenter agent is responsible for keeping this directory current — see `.claude/agents/technical-documenter.md`.
