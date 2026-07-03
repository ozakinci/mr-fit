# Mr. Fit

A bodyweight home-workout idle game, built with Vue 3, TypeScript, Vite, and Pinia.

**Status:** the current build is still the original generic idle-clicker prototype (click for currency, buy generators/upgrades). It's mid-pivot to the fitness theme described in [`project/requirements.md`](project/requirements.md) — see [`project/tickets.md`](project/tickets.md) (milestones M1–M2) for what's landed vs. still pending. The loop below describes what's actually running today.

Click to earn currency, buy generators that earn it for you automatically, buy upgrades to boost both — the classic idle-game loop. Progress saves automatically in your browser, including some progress while you're away.

## Play locally

```
npm install
npm run dev
```

Then open the URL Vite prints (`http://localhost:5173` by default).

## Learn more

- [How to play](docs/how-to-play.md) / [FAQ](docs/faq.md) — for players
- [Architecture](docs/technical/architecture.md) and [decision records](docs/technical/adr/) — for contributors
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to get set up and propose changes
- [AGENTS.md](AGENTS.md) — this repo's multi-agent Claude Code development workflow
