# Multi-agent setup

Mr. Fit is developed using six project-scoped Claude Code subagents, each owning a distinct slice of the project so work can be delegated without agents stepping on each other's files. Definitions live in [`.claude/agents/`](.claude/agents/); this document is the map of how they fit together.

| Agent | Owns | Model | Notes |
|---|---|---|---|
| [`project-manager`](.claude/agents/project-manager.md) | `project/requirements.md`, `project/tickets.md`, `project/roadmap.md` | sonnet | Turns ideas into versioned requirements + ticket-numbered (`MRFIT-N`) backlog items. Writes no code. |
| [`main-dev`](.claude/agents/main-dev.md) | `src/**`, project config | inherit | All application development. |
| [`tester`](.claude/agents/tester.md) | `../mr-fit-tester` (sibling project, outside this repo) | sonnet | Black-box E2E testing over HTTP. Never reads `src/`. |
| [`documenter`](.claude/agents/documenter.md) | `docs/*.md` (not `docs/technical/`) | sonnet | Player-facing docs only, zero implementation detail. |
| [`technical-documenter`](.claude/agents/technical-documenter.md) | `docs/technical/`, `CONTRIBUTING.md` | sonnet | Architecture docs, ADRs, contributor onboarding. |
| [`code-reviewer`](.claude/agents/code-reviewer.md) | reviews only, edits nothing | **opus** | Independent second opinion on a stronger model. Read-only. |

## Why these boundaries

Each agent's `tools:`/`disallowedTools:` frontmatter and system prompt both push in the same direction: a subagent that can only touch its own domain can't accidentally overwrite another agent's work, and a reviewer that *can't* edit files can't quietly "fix" what it was supposed to be independently judging. The tester living in a genuinely separate project (`../mr-fit-tester`, not a subfolder of this repo) is the same idea taken further — it can't accidentally test against its own assumptions about the source, because it has no access to the source at all.

## Typical handoff

1. **project-manager** turns a feature idea into a ticket in `project/tickets.md` (and a requirements update if it changes what/why, not just how).
2. **main-dev** implements it, typechecks, and builds.
3. **tester** (from `../mr-fit-tester`) drives the running app as a black box and reports pass/fail.
4. **documenter** updates player-facing docs if the change is player-visible.
5. **technical-documenter** records an ADR if the change was architecturally significant, and keeps `docs/technical/architecture.md` current.
6. **code-reviewer** gives an independent, opus-backed review of the commit before it's considered done.

Not every change needs all six steps — a one-line bug fix doesn't need a new backlog item or an ADR. Use judgment.

## Invoking an agent

Ask by name in conversation ("use the main-dev agent to implement X"), `@`-mention it for a single task, or run a whole session as one with `claude --agent <name>`. See the [subagents documentation](https://code.claude.com/docs/en/sub-agents) for details.

## The external tester project

`D:\Code\Github\mr-fit-tester` is a sibling folder to this repo (not nested inside it), with its own `package.json` and Playwright suite. It exists so testing happens from a genuinely external vantage point — the way an outside QA process or a curious open-source contributor would poke at the running game, not the way its own author would. See that project's `README.md` for setup.

## Commit conventions (enforced)

Two git hooks are live in this repo (`git config core.hooksPath .githooks`; the scripts live in [`.githooks/`](.githooks/)):

- **`commit-msg`** — blocks any commit whose message doesn't reference a ticket ID (`MRFIT-N`, see `project/tickets.md`). Mechanical, free, no agent involved. Bypass with `git commit --no-verify` for a genuine exception.
- **`post-commit`** — after every commit, in the background, non-blocking: `code-reviewer` (opus) reviews the commit and writes findings to `.review/<sha>.md`; `tester` drafts/updates external Playwright coverage for the commit's intent in `../mr-fit-tester`, left **uncommitted** there for human review. Both cost real API usage per commit — skip either one for a single commit with `MRFIT_SKIP_REVIEW_HOOK=1` / `MRFIT_SKIP_TESTER_HOOK=1`, or disable both entirely with `git config --unset core.hooksPath`.

main-dev's convention is small, single-functionality commits (`.claude/agents/main-dev.md` § Working with git) — expect many small ticket-tagged commits rather than a few large ones, and budget for the hook cost accordingly.

**Known gap:** `post-commit` currently no-ops on a plain VSCode-extension setup — it shells out to a `claude` CLI binary, and none was found on this machine's PATH (checked Git Bash, PowerShell, npm globals). Install the CLI separately if you want the automated review/test-draft to actually fire; `commit-msg` doesn't need it and works regardless.

## Independent code review

`code-reviewer` runs on Opus specifically so review isn't the same model rationalizing its own prior reasoning. It runs automatically after every commit (see above, gap notwithstanding) and is also invokable on demand ("use the code-reviewer agent on the last commit").

## Continuity across sessions

[`project/agent-log.md`](project/agent-log.md) is a shared, append-only log every agent reads at the start of its work and writes to after every change — the mechanism that keeps work coherent across a session restart or a context/token reset, which otherwise wipes the conversation but not this file. Retention is 3 days; whichever agent's entry pushes it past that prunes the oldest day. `code-reviewer` can't write it directly (read-only by design) — it appends a `LOG:` line to its report instead, for whoever invoked it to relay.
