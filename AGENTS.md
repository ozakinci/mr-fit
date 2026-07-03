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

## Independent code review

`code-reviewer` runs on Opus specifically so review isn't the same model rationalizing its own prior reasoning. It's invokable on demand ("use the code-reviewer agent on the last commit"). There's also an **opt-in, disabled-by-default** git hook at `.githooks/post-commit` that runs it automatically after every local commit — see that file's header comment for how to turn it on, and be aware it costs real API usage per commit before enabling it.
