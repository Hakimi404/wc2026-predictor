import { Team, getTeam } from "./teams";

export interface ScoreProb {
  home: number;
  away: number;
  prob: number;
}

export interface LayerBreakdown {
  win_a: number;
  draw: number;
  win_b: number;
}

export interface Prediction {
  home: string;
  away: string;
  win_a: number;
  draw: number;
  win_b: number;
  xg_a: number;
  xg_b: number;
  most_likely_score: ScoreProb[];
  confidence: number;
  score_matrix: number[][]; // 7x7, [home][away]
  breakdown: {
    dixonColes: LayerBreakdown;
    elo: LayerBreakdown;
    form: LayerBreakdown;
    h2h: LayerBreakdown;
  };
}

const WEIGHTS = {
  dixonColes: 0.45,
  elo: 0.35,
  form: 0.12,
  h2h: 0.08,
};

const RHO = -0.13;
const HOME_ADVANTAGE = 1.1;
const MAX_GOALS = 10;
const HEATMAP_GOALS = 7;

// Known head-to-head bonuses (bonus applied to the first-listed team's win probability)
const H2H_BONUSES: Record<string, number> = {
  "japan_germany": 0.04,
  "germany_japan": -0.04,
  "morocco_portugal": 0.05,
  "portugal_morocco": -0.05,
  "argentina_brazil": 0.02,
  "brazil_argentina": -0.02,
  "england_france": -0.02,
  "france_england": 0.02,
  "usa_mexico": 0.03,
  "mexico_usa": -0.03,
};

function poissonPmf(k: number, lambda: number): number {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function tau(x: number, y: number, mu: number, nu: number, rho: number): number {
  if (x === 0 && y === 0) return 1 - mu * nu * rho;
  if (x === 0 && y === 1) return 1 + mu * rho;
  if (x === 1 && y === 0) return 1 + nu * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

/** Layer 1 — Dixon-Coles Poisson model */
function dixonColes(home: Team, away: Team) {
  const mu = home.attack_rate * away.defence_rate * HOME_ADVANTAGE;
  const nu = away.attack_rate * home.defence_rate;

  const matrix: number[][] = [];
  let total = 0;
  for (let x = 0; x <= MAX_GOALS; x++) {
    const row: number[] = [];
    for (let y = 0; y <= MAX_GOALS; y++) {
      const p = tau(x, y, mu, nu, RHO) * poissonPmf(x, mu) * poissonPmf(y, nu);
      row.push(p);
      total += p;
    }
    matrix.push(row);
  }

  // Normalize after rho correction
  for (let x = 0; x <= MAX_GOALS; x++) {
    for (let y = 0; y <= MAX_GOALS; y++) {
      matrix[x][y] /= total;
    }
  }

  let win_a = 0;
  let draw = 0;
  let win_b = 0;
  let xg_a = 0;
  let xg_b = 0;
  for (let x = 0; x <= MAX_GOALS; x++) {
    for (let y = 0; y <= MAX_GOALS; y++) {
      const p = matrix[x][y];
      if (x > y) win_a += p;
      else if (x === y) draw += p;
      else win_b += p;
      xg_a += x * p;
      xg_b += y * p;
    }
  }

  return { win_a, draw, win_b, xg_a, xg_b, matrix };
}

/** Layer 2 — ELO rating model */
function eloLayer(home: Team, away: Team): LayerBreakdown {
  const expectedA = 1 / (1 + Math.pow(10, (away.elo - home.elo) / 400));
  const drawRate = 0.22;
  const win_a = expectedA * (1 - drawRate);
  const win_b = (1 - expectedA) * (1 - drawRate);
  return { win_a, draw: drawRate, win_b };
}

/** Layer 3 — Recent form model */
function formLayer(home: Team, away: Team): LayerBreakdown {
  const adjustment = (home.form_pts - away.form_pts) / 10;
  const base = 1 / 3;
  return {
    win_a: base + adjustment,
    draw: base,
    win_b: base - adjustment,
  };
}

/** Layer 4 — Head-to-head model */
function h2hLayer(home: Team, away: Team): LayerBreakdown {
  const bonus = H2H_BONUSES[`${home.id}_${away.id}`] ?? 0;
  const base = 1 / 3;
  return {
    win_a: base + bonus,
    draw: base,
    win_b: base - bonus,
  };
}

function clip01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function predictMatch(homeId: string, awayId: string): Prediction | null {
  const home = getTeam(homeId);
  const away = getTeam(awayId);
  if (!home || !away) return null;

  const dc = dixonColes(home, away);
  const elo = eloLayer(home, away);
  const form = formLayer(home, away);
  const h2h = h2hLayer(home, away);

  const dcBreakdown: LayerBreakdown = { win_a: dc.win_a, draw: dc.draw, win_b: dc.win_b };

  let win_a =
    WEIGHTS.dixonColes * dcBreakdown.win_a +
    WEIGHTS.elo * elo.win_a +
    WEIGHTS.form * form.win_a +
    WEIGHTS.h2h * h2h.win_a;
  let draw =
    WEIGHTS.dixonColes * dcBreakdown.draw +
    WEIGHTS.elo * elo.draw +
    WEIGHTS.form * form.draw +
    WEIGHTS.h2h * h2h.draw;
  let win_b =
    WEIGHTS.dixonColes * dcBreakdown.win_b +
    WEIGHTS.elo * elo.win_b +
    WEIGHTS.form * form.win_b +
    WEIGHTS.h2h * h2h.win_b;

  win_a = clip01(win_a);
  draw = clip01(draw);
  win_b = clip01(win_b);

  const sum = win_a + draw + win_b;
  win_a /= sum;
  draw /= sum;
  win_b /= sum;

  // Top 5 most likely scorelines from the full Dixon-Coles matrix
  const scores: ScoreProb[] = [];
  for (let x = 0; x <= MAX_GOALS; x++) {
    for (let y = 0; y <= MAX_GOALS; y++) {
      scores.push({ home: x, away: y, prob: dc.matrix[x][y] });
    }
  }
  scores.sort((a, b) => b.prob - a.prob);
  const most_likely_score = scores.slice(0, 5);

  // 7x7 heatmap matrix
  const score_matrix: number[][] = [];
  for (let x = 0; x < HEATMAP_GOALS; x++) {
    score_matrix.push(dc.matrix[x].slice(0, HEATMAP_GOALS));
  }

  const confidence = Math.round(Math.max(win_a, draw, win_b) * 100);

  return {
    home: home.id,
    away: away.id,
    win_a,
    draw,
    win_b,
    xg_a: dc.xg_a,
    xg_b: dc.xg_b,
    most_likely_score,
    confidence,
    score_matrix,
    breakdown: {
      dixonColes: dcBreakdown,
      elo,
      form,
      h2h,
    },
  };
}

/** Re-run with a slightly randomized seed for the "Refresh Prediction" Monte Carlo button */
export function predictMatchWithSeed(homeId: string, awayId: string, seed: number): Prediction | null {
  const home = getTeam(homeId);
  const away = getTeam(awayId);
  if (!home || !away) return null;

  // Apply small seeded jitter to form rates to simulate Monte Carlo variance
  const rng = mulberry32(seed);
  const jitterHome: Team = { ...home, form_pts: home.form_pts + (rng() - 0.5) * 0.6 };
  const jitterAway: Team = { ...away, form_pts: away.form_pts + (rng() - 0.5) * 0.6 };

  // Temporarily predict using jittered teams by constructing a fake registry lookup
  const dc = dixonColes(home, away);
  const elo = eloLayer(home, away);
  const form = formLayer(jitterHome, jitterAway);
  const h2h = h2hLayer(home, away);

  let win_a =
    WEIGHTS.dixonColes * dc.win_a + WEIGHTS.elo * elo.win_a + WEIGHTS.form * form.win_a + WEIGHTS.h2h * h2h.win_a;
  let draw =
    WEIGHTS.dixonColes * dc.draw + WEIGHTS.elo * elo.draw + WEIGHTS.form * form.draw + WEIGHTS.h2h * h2h.draw;
  let win_b =
    WEIGHTS.dixonColes * dc.win_b + WEIGHTS.elo * elo.win_b + WEIGHTS.form * form.win_b + WEIGHTS.h2h * h2h.win_b;

  win_a = clip01(win_a);
  draw = clip01(draw);
  win_b = clip01(win_b);
  const sum = win_a + draw + win_b;
  win_a /= sum;
  draw /= sum;
  win_b /= sum;

  const scores: ScoreProb[] = [];
  for (let x = 0; x <= MAX_GOALS; x++) {
    for (let y = 0; y <= MAX_GOALS; y++) {
      scores.push({ home: x, away: y, prob: dc.matrix[x][y] });
    }
  }
  scores.sort((a, b) => b.prob - a.prob);

  const score_matrix: number[][] = [];
  for (let x = 0; x < HEATMAP_GOALS; x++) {
    score_matrix.push(dc.matrix[x].slice(0, HEATMAP_GOALS));
  }

  return {
    home: home.id,
    away: away.id,
    win_a,
    draw,
    win_b,
    xg_a: dc.xg_a,
    xg_b: dc.xg_b,
    most_likely_score: scores.slice(0, 5),
    confidence: Math.round(Math.max(win_a, draw, win_b) * 100),
    score_matrix,
    breakdown: {
      dixonColes: { win_a: dc.win_a, draw: dc.draw, win_b: dc.win_b },
      elo,
      form,
      h2h,
    },
  };
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
