export type Stage =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-Finals"
  | "Semi-Finals"
  | "Third Place"
  | "Final";

export interface Match {
  matchId: string;
  date: string; // YYYY-MM-DD (CEST calendar date)
  time: string; // HH:MM CEST (German time)
  group: string | null;
  stage: Stage;
  homeTeam: string; // team id, or placeholder label for knockout
  awayTeam: string;
  venue: string;
  city: string;
}

// Official group assignments (A-L), 4 teams each.
export const groups: Record<string, string[]> = {
  A: ["mexico", "southafrica", "southkorea", "czechrepublic"],
  B: ["canada", "bosnia", "qatar", "switzerland"],
  C: ["brazil", "morocco", "haiti", "scotland"],
  D: ["usa", "paraguay", "australia", "turkey"],
  E: ["germany", "curacao", "ivorycoast", "ecuador"],
  F: ["netherlands", "japan", "sweden", "tunisia"],
  G: ["belgium", "egypt", "iran", "newzealand"],
  H: ["spain", "capeverde", "saudiarabia", "uruguay"],
  I: ["france", "senegal", "iraq", "norway"],
  J: ["argentina", "algeria", "austria", "jordan"],
  K: ["portugal", "congodr", "uzbekistan", "colombia"],
  L: ["england", "croatia", "ghana", "panama"],
};

const VENUES: Record<string, { venue: string; city: string }> = {
  MEX: { venue: "Estadio Azteca", city: "Mexico City" },
  GDL: { venue: "Estadio Akron", city: "Guadalajara" },
  MTY: { venue: "Estadio BBVA", city: "Monterrey" },
  VAN: { venue: "BC Place", city: "Vancouver" },
  TOR: { venue: "BMO Field", city: "Toronto" },
  NJ: { venue: "MetLife Stadium", city: "New York/New Jersey" },
  DAL: { venue: "AT&T Stadium", city: "Dallas" },
  HOU: { venue: "NRG Stadium", city: "Houston" },
  ATL: { venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  MIA: { venue: "Hard Rock Stadium", city: "Miami" },
  SF: { venue: "Levi's Stadium", city: "San Francisco" },
  LAX: { venue: "SoFi Stadium", city: "Los Angeles" },
  SEA: { venue: "Lumen Field", city: "Seattle" },
  KC: { venue: "Arrowhead Stadium", city: "Kansas City" },
  PHI: { venue: "Lincoln Financial Field", city: "Philadelphia" },
  BOS: { venue: "Gillette Stadium", city: "Boston" },
};

function addDays(start: string, days: number): string {
  const d = new Date(start + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Converts a US Eastern Time (ET, UTC-4 during the tournament) kickoff into German local
 * time (CEST, UTC+2) — a 6-hour offset, with the calendar date rolling over to the next
 * day for late-night ET kickoffs.
 */
function et(dateET: string, hourET: number, minuteET = 0): { date: string; time: string } {
  const totalMin = hourET * 60 + minuteET + 6 * 60;
  const dayOffset = Math.floor(totalMin / 1440);
  const minOfDay = totalMin % 1440;
  const h = Math.floor(minOfDay / 60);
  const m = minOfDay % 60;
  return {
    date: addDays(dateET, dayOffset),
    time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
  };
}

interface RawGroupMatch {
  date: string;
  hour: number;
  min?: number;
  home: string;
  away: string;
  group: string;
  city: keyof typeof VENUES;
}

// 72 group-stage matches, exact dates/times (US Eastern Time) per official schedule.
const rawGroupStage: RawGroupMatch[] = [
  // Matchday 1
  { date: "2026-06-11", hour: 15, home: "mexico", away: "southafrica", group: "A", city: "MEX" },
  { date: "2026-06-11", hour: 22, home: "southkorea", away: "czechrepublic", group: "A", city: "GDL" },
  { date: "2026-06-12", hour: 15, home: "canada", away: "bosnia", group: "B", city: "TOR" },
  { date: "2026-06-12", hour: 21, home: "usa", away: "paraguay", group: "D", city: "LAX" },
  { date: "2026-06-13", hour: 18, home: "brazil", away: "morocco", group: "C", city: "NJ" },
  { date: "2026-06-13", hour: 21, home: "haiti", away: "scotland", group: "C", city: "BOS" },
  { date: "2026-06-13", hour: 15, home: "qatar", away: "switzerland", group: "B", city: "SF" },
  { date: "2026-06-13", hour: 0, home: "australia", away: "turkey", group: "D", city: "VAN" },
  { date: "2026-06-14", hour: 13, home: "germany", away: "curacao", group: "E", city: "HOU" },
  { date: "2026-06-14", hour: 19, home: "ivorycoast", away: "ecuador", group: "E", city: "PHI" },
  { date: "2026-06-14", hour: 16, home: "netherlands", away: "japan", group: "F", city: "DAL" },
  { date: "2026-06-14", hour: 22, home: "sweden", away: "tunisia", group: "F", city: "MTY" },
  { date: "2026-06-15", hour: 15, home: "belgium", away: "egypt", group: "G", city: "SEA" },
  { date: "2026-06-15", hour: 21, home: "iran", away: "newzealand", group: "G", city: "LAX" },
  { date: "2026-06-15", hour: 12, home: "spain", away: "capeverde", group: "H", city: "ATL" },
  { date: "2026-06-15", hour: 18, home: "saudiarabia", away: "uruguay", group: "H", city: "MIA" },
  { date: "2026-06-16", hour: 15, home: "france", away: "senegal", group: "I", city: "NJ" },
  { date: "2026-06-16", hour: 18, home: "iraq", away: "norway", group: "I", city: "BOS" },
  { date: "2026-06-16", hour: 21, home: "argentina", away: "algeria", group: "J", city: "KC" },
  { date: "2026-06-16", hour: 0, home: "austria", away: "jordan", group: "J", city: "SF" },
  { date: "2026-06-17", hour: 13, home: "portugal", away: "congodr", group: "K", city: "HOU" },
  { date: "2026-06-17", hour: 22, home: "uzbekistan", away: "colombia", group: "K", city: "MEX" },
  { date: "2026-06-17", hour: 16, home: "england", away: "croatia", group: "L", city: "DAL" },
  { date: "2026-06-17", hour: 19, home: "ghana", away: "panama", group: "L", city: "TOR" },
  // Matchday 2
  { date: "2026-06-18", hour: 12, home: "czechrepublic", away: "southafrica", group: "A", city: "ATL" },
  { date: "2026-06-18", hour: 21, home: "mexico", away: "southkorea", group: "A", city: "GDL" },
  { date: "2026-06-18", hour: 15, home: "switzerland", away: "bosnia", group: "B", city: "LAX" },
  { date: "2026-06-18", hour: 18, home: "canada", away: "qatar", group: "B", city: "VAN" },
  { date: "2026-06-19", hour: 20, min: 30, home: "brazil", away: "haiti", group: "C", city: "PHI" },
  { date: "2026-06-19", hour: 18, home: "scotland", away: "morocco", group: "C", city: "BOS" },
  { date: "2026-06-19", hour: 15, home: "usa", away: "australia", group: "D", city: "SEA" },
  { date: "2026-06-19", hour: 23, home: "turkey", away: "paraguay", group: "D", city: "SF" },
  { date: "2026-06-20", hour: 16, home: "germany", away: "ivorycoast", group: "E", city: "TOR" },
  { date: "2026-06-20", hour: 20, home: "ecuador", away: "curacao", group: "E", city: "KC" },
  { date: "2026-06-20", hour: 13, home: "netherlands", away: "sweden", group: "F", city: "HOU" },
  { date: "2026-06-20", hour: 0, home: "tunisia", away: "japan", group: "F", city: "MTY" },
  { date: "2026-06-21", hour: 12, home: "spain", away: "saudiarabia", group: "H", city: "ATL" },
  { date: "2026-06-21", hour: 18, home: "uruguay", away: "capeverde", group: "H", city: "MIA" },
  { date: "2026-06-21", hour: 15, home: "belgium", away: "iran", group: "G", city: "LAX" },
  { date: "2026-06-21", hour: 21, home: "newzealand", away: "egypt", group: "G", city: "VAN" },
  { date: "2026-06-22", hour: 17, home: "france", away: "iraq", group: "I", city: "PHI" },
  { date: "2026-06-22", hour: 20, home: "norway", away: "senegal", group: "I", city: "NJ" },
  { date: "2026-06-22", hour: 13, home: "argentina", away: "austria", group: "J", city: "DAL" },
  { date: "2026-06-22", hour: 23, home: "jordan", away: "algeria", group: "J", city: "SF" },
  { date: "2026-06-23", hour: 13, home: "portugal", away: "uzbekistan", group: "K", city: "HOU" },
  { date: "2026-06-23", hour: 22, home: "colombia", away: "congodr", group: "K", city: "GDL" },
  { date: "2026-06-23", hour: 16, home: "england", away: "ghana", group: "L", city: "BOS" },
  { date: "2026-06-23", hour: 19, home: "panama", away: "croatia", group: "L", city: "TOR" },
  // Matchday 3
  { date: "2026-06-24", hour: 21, home: "mexico", away: "czechrepublic", group: "A", city: "MEX" },
  { date: "2026-06-24", hour: 21, home: "southafrica", away: "southkorea", group: "A", city: "MTY" },
  { date: "2026-06-24", hour: 15, home: "switzerland", away: "canada", group: "B", city: "VAN" },
  { date: "2026-06-24", hour: 15, home: "bosnia", away: "qatar", group: "B", city: "SEA" },
  { date: "2026-06-24", hour: 18, home: "brazil", away: "scotland", group: "C", city: "MIA" },
  { date: "2026-06-24", hour: 18, home: "morocco", away: "haiti", group: "C", city: "ATL" },
  { date: "2026-06-25", hour: 22, home: "turkey", away: "usa", group: "D", city: "LAX" },
  { date: "2026-06-25", hour: 22, home: "paraguay", away: "australia", group: "D", city: "SF" },
  { date: "2026-06-25", hour: 16, home: "ecuador", away: "germany", group: "E", city: "NJ" },
  { date: "2026-06-25", hour: 16, home: "curacao", away: "ivorycoast", group: "E", city: "PHI" },
  { date: "2026-06-25", hour: 19, home: "japan", away: "sweden", group: "F", city: "DAL" },
  { date: "2026-06-25", hour: 19, home: "tunisia", away: "netherlands", group: "F", city: "KC" },
  { date: "2026-06-26", hour: 23, home: "newzealand", away: "belgium", group: "G", city: "VAN" },
  { date: "2026-06-26", hour: 23, home: "egypt", away: "iran", group: "G", city: "SEA" },
  { date: "2026-06-26", hour: 20, home: "uruguay", away: "spain", group: "H", city: "GDL" },
  { date: "2026-06-26", hour: 20, home: "capeverde", away: "saudiarabia", group: "H", city: "HOU" },
  { date: "2026-06-26", hour: 15, home: "norway", away: "france", group: "I", city: "BOS" },
  { date: "2026-06-26", hour: 15, home: "senegal", away: "iraq", group: "I", city: "TOR" },
  { date: "2026-06-27", hour: 22, home: "jordan", away: "argentina", group: "J", city: "DAL" },
  { date: "2026-06-27", hour: 22, home: "algeria", away: "austria", group: "J", city: "KC" },
  { date: "2026-06-27", hour: 19, min: 30, home: "colombia", away: "portugal", group: "K", city: "MIA" },
  { date: "2026-06-27", hour: 19, min: 30, home: "congodr", away: "uzbekistan", group: "K", city: "ATL" },
  { date: "2026-06-27", hour: 17, home: "panama", away: "england", group: "L", city: "NJ" },
  { date: "2026-06-27", hour: 17, home: "croatia", away: "ghana", group: "L", city: "PHI" },
];

const groupStage: Match[] = rawGroupStage.map((m, i) => {
  const { date, time } = et(m.date, m.hour, m.min ?? 0);
  const v = VENUES[m.city];
  return {
    matchId: `M${i + 1}`,
    date,
    time,
    group: m.group,
    stage: "Group Stage",
    homeTeam: m.home,
    awayTeam: m.away,
    venue: v.venue,
    city: v.city,
  };
});

interface RawKnockoutMatch {
  id: string;
  date: string;
  hour: number;
  min?: number;
  home: string;
  away: string;
  stage: Stage;
  city: keyof typeof VENUES;
}

// Round of 32 (16 matches), June 28 - July 3 (ET).
// "1X"/"2X" = winner/runner-up of group X. "3rd-XXXXX" = best third-placed team from one of
// the listed groups (final identity decided once the group stage concludes).
const rawR32: RawKnockoutMatch[] = [
  { id: "R32-1", date: "2026-06-28", hour: 15, home: "2A", away: "2B", stage: "Round of 32", city: "LAX" },
  { id: "R32-2", date: "2026-06-29", hour: 13, home: "1C", away: "2F", stage: "Round of 32", city: "HOU" },
  { id: "R32-3", date: "2026-06-29", hour: 16, min: 30, home: "1E", away: "3rd-ABCDF", stage: "Round of 32", city: "BOS" },
  { id: "R32-4", date: "2026-06-29", hour: 21, home: "1F", away: "2C", stage: "Round of 32", city: "MTY" },
  { id: "R32-5", date: "2026-06-30", hour: 13, home: "2E", away: "2I", stage: "Round of 32", city: "DAL" },
  { id: "R32-6", date: "2026-06-30", hour: 17, home: "1I", away: "3rd-CDFGH", stage: "Round of 32", city: "NJ" },
  { id: "R32-7", date: "2026-06-30", hour: 21, home: "1A", away: "3rd-CEFHI", stage: "Round of 32", city: "MEX" },
  { id: "R32-8", date: "2026-07-01", hour: 12, home: "1L", away: "3rd-EHIJK", stage: "Round of 32", city: "ATL" },
  { id: "R32-9", date: "2026-07-01", hour: 16, home: "1G", away: "3rd-AEHIJ", stage: "Round of 32", city: "SEA" },
  { id: "R32-10", date: "2026-07-01", hour: 20, home: "1D", away: "3rd-BEFIJ", stage: "Round of 32", city: "SF" },
  { id: "R32-11", date: "2026-07-02", hour: 15, home: "1H", away: "2J", stage: "Round of 32", city: "LAX" },
  { id: "R32-12", date: "2026-07-02", hour: 19, home: "2K", away: "2L", stage: "Round of 32", city: "TOR" },
  { id: "R32-13", date: "2026-07-02", hour: 23, home: "1B", away: "3rd-EFGIJ", stage: "Round of 32", city: "VAN" },
  { id: "R32-14", date: "2026-07-03", hour: 18, home: "1J", away: "2H", stage: "Round of 32", city: "MIA" },
  { id: "R32-15", date: "2026-07-03", hour: 21, min: 30, home: "1K", away: "3rd-DEIJL", stage: "Round of 32", city: "KC" },
  { id: "R32-16", date: "2026-07-03", hour: 14, home: "2D", away: "2G", stage: "Round of 32", city: "DAL" },
];

// Round of 16 (8 matches), July 4-7 (ET).
const rawR16: RawKnockoutMatch[] = [
  { id: "R16-1", date: "2026-07-04", hour: 13, home: "Winner R32-1", away: "Winner R32-3", stage: "Round of 16", city: "HOU" },
  { id: "R16-2", date: "2026-07-04", hour: 17, home: "Winner R32-2", away: "Winner R32-5", stage: "Round of 16", city: "PHI" },
  { id: "R16-3", date: "2026-07-05", hour: 16, home: "Winner R32-4", away: "Winner R32-6", stage: "Round of 16", city: "NJ" },
  { id: "R16-4", date: "2026-07-05", hour: 20, home: "Winner R32-7", away: "Winner R32-8", stage: "Round of 16", city: "MEX" },
  { id: "R16-5", date: "2026-07-06", hour: 15, home: "Winner R32-11", away: "Winner R32-12", stage: "Round of 16", city: "DAL" },
  { id: "R16-6", date: "2026-07-06", hour: 20, home: "Winner R32-9", away: "Winner R32-10", stage: "Round of 16", city: "SEA" },
  { id: "R16-7", date: "2026-07-07", hour: 12, home: "Winner R32-14", away: "Winner R32-16", stage: "Round of 16", city: "ATL" },
  { id: "R16-8", date: "2026-07-07", hour: 16, home: "Winner R32-13", away: "Winner R32-15", stage: "Round of 16", city: "VAN" },
];

// Quarter-finals (4 matches), July 9-11 (ET).
const rawQF: RawKnockoutMatch[] = [
  { id: "QF-1", date: "2026-07-09", hour: 16, home: "Winner R16-1", away: "Winner R16-2", stage: "Quarter-Finals", city: "BOS" },
  { id: "QF-2", date: "2026-07-10", hour: 15, home: "Winner R16-5", away: "Winner R16-6", stage: "Quarter-Finals", city: "LAX" },
  { id: "QF-3", date: "2026-07-11", hour: 17, home: "Winner R16-3", away: "Winner R16-4", stage: "Quarter-Finals", city: "MIA" },
  { id: "QF-4", date: "2026-07-11", hour: 21, home: "Winner R16-7", away: "Winner R16-8", stage: "Quarter-Finals", city: "KC" },
];

// Semi-finals (2 matches), July 14-15 (ET).
const rawSF: RawKnockoutMatch[] = [
  { id: "SF-1", date: "2026-07-14", hour: 15, home: "Winner QF-1", away: "Winner QF-2", stage: "Semi-Finals", city: "DAL" },
  { id: "SF-2", date: "2026-07-15", hour: 15, home: "Winner QF-3", away: "Winner QF-4", stage: "Semi-Finals", city: "ATL" },
];

const raw3rdAndFinal: RawKnockoutMatch[] = [
  { id: "3RD", date: "2026-07-18", hour: 17, home: "Loser SF-1", away: "Loser SF-2", stage: "Third Place", city: "MIA" },
  { id: "FINAL", date: "2026-07-19", hour: 15, home: "Winner SF-1", away: "Winner SF-2", stage: "Final", city: "NJ" },
];

const knockout: Match[] = [...rawR32, ...rawR16, ...rawQF, ...rawSF, ...raw3rdAndFinal].map((m) => {
  const { date, time } = et(m.date, m.hour, m.min ?? 0);
  const v = VENUES[m.city];
  return {
    matchId: m.id,
    date,
    time,
    group: null,
    stage: m.stage,
    homeTeam: m.home,
    awayTeam: m.away,
    venue: v.venue,
    city: v.city,
  };
});

export const schedule: Match[] = [...groupStage, ...knockout];

export function getMatch(matchId: string): Match | undefined {
  return schedule.find((m) => m.matchId === matchId);
}

export const stages: Stage[] = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter-Finals",
  "Semi-Finals",
  "Third Place",
  "Final",
];

export const groupLettersList = Object.keys(groups);
