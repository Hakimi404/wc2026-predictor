import { groups, schedule } from "./schedule";
import { getTeam } from "./teams";
import { predictMatch } from "./prediction";

export interface StandingRow {
  teamId: string;
  name: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  xg: number;
  elo: number;
  status: "qualified" | "best-third" | "eliminated";
}

function simulatedScore(xgA: number, xgB: number): [number, number] {
  return [Math.round(xgA), Math.round(xgB)];
}

function buildGroupTable(letter: string): StandingRow[] {
  const teamIds = groups[letter];
  const rows: Record<string, StandingRow> = {};
  for (const id of teamIds) {
    const team = getTeam(id);
    if (!team) continue;
    rows[id] = {
      teamId: id,
      name: team.name,
      flag: team.flag,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      xg: 0,
      elo: team.elo,
      status: "eliminated",
    };
  }

  const matches = schedule.filter((m) => m.group === letter && m.stage === "Group Stage");
  for (const match of matches) {
    const pred = predictMatch(match.homeTeam, match.awayTeam);
    if (!pred) continue;
    const [scoreA, scoreB] = simulatedScore(pred.xg_a, pred.xg_b);

    const home = rows[match.homeTeam];
    const away = rows[match.awayTeam];
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.goalsFor += scoreA;
    home.goalsAgainst += scoreB;
    away.goalsFor += scoreB;
    away.goalsAgainst += scoreA;
    home.xg += pred.xg_a;
    away.xg += pred.xg_b;

    if (scoreA > scoreB) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (scoreA < scoreB) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }

  for (const row of Object.values(rows)) {
    row.goalDiff = row.goalsFor - row.goalsAgainst;
    row.xg = Math.round((row.xg / Math.max(1, row.played)) * 100) / 100;
  }

  return Object.values(rows).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return b.elo - a.elo;
  });
}

export function getAllStandings(): Record<string, StandingRow[]> {
  const result: Record<string, StandingRow[]> = {};
  const thirdPlaced: { letter: string; row: StandingRow }[] = [];

  for (const letter of Object.keys(groups)) {
    const table = buildGroupTable(letter);
    table.forEach((row, idx) => {
      if (idx < 2) row.status = "qualified";
      else if (idx === 2) thirdPlaced.push({ letter, row });
      else row.status = "eliminated";
    });
    result[letter] = table;
  }

  // Best 8 of the 12 third-placed teams advance to the Round of 32
  const sortedThirds = [...thirdPlaced].sort((a, b) => {
    if (b.row.points !== a.row.points) return b.row.points - a.row.points;
    if (b.row.goalDiff !== a.row.goalDiff) return b.row.goalDiff - a.row.goalDiff;
    if (b.row.goalsFor !== a.row.goalsFor) return b.row.goalsFor - a.row.goalsFor;
    return b.row.elo - a.row.elo;
  });

  sortedThirds.forEach((entry, idx) => {
    entry.row.status = idx < 8 ? "best-third" : "eliminated";
  });

  return result;
}
