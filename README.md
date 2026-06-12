# WC2026 Predictor

A full-stack FIFA World Cup 2026 prediction dashboard built with Next.js (App Router), TypeScript,
and Tailwind CSS. It includes a 5-layer statistical prediction engine (Dixon-Coles Poisson, ELO,
recent form, and head-to-head history) plus optional Claude-powered match analysis.

## Features

- **Home** — Countdown to kickoff, today's matches, and the full 104-match schedule with
  filters by date, group (A-L), and stage.
- **Predict** — Win probability bars, expected goals, top scorelines, a confidence meter, a
  model breakdown table, a 7x7 score probability heatmap, and an "Ask Claude" button for a
  3-paragraph expert analysis.
- **Standings** — Simulated group tables for all 12 groups with qualification status.
- **My Tips** — Save your predictions locally and track correct/wrong/pending results.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your Anthropic API key:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and set `ANTHROPIC_API_KEY=your_key_here`. Without a key, the
   "Ask Claude" feature falls back to a basic statistical summary.

3. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
vercel deploy
```

Make sure to add `ANTHROPIC_API_KEY` as an environment variable in your Vercel project
settings (Project Settings → Environment Variables) so the "Ask Claude" feature works in
production.

## Prediction Engine

See [`lib/prediction.ts`](lib/prediction.ts) for the full implementation. The ensemble combines:

| Layer            | Weight | Description                                      |
| ---------------- | ------ | ------------------------------------------------- |
| Dixon-Coles Poisson | 45%  | Score matrix from attack/defence rates with rho correction |
| ELO Rating       | 35%    | Win/draw/loss from ELO difference, 22% draw baseline |
| Recent Form      | 12%    | Adjustment from points-per-game over last 10 matches |
| Head-to-Head     | 8%     | Known historical matchup bonuses                  |

---

Predictions powered by Dixon-Coles + ELO + Monte Carlo · Built by Abdullah Al-Hakimi
