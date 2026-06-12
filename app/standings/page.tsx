"use client";

import { getAllStandings } from "@/lib/standings";
import { useLanguage } from "@/lib/i18n";

const statusStyles: Record<string, string> = {
  qualified: "bg-green/10 border-l-4 border-l-green",
  "best-third": "bg-blue/10 border-l-4 border-l-blue",
  eliminated: "bg-red/10 border-l-4 border-l-red",
};

export default function StandingsPage() {
  const { t } = useLanguage();
  const standings = getAllStandings();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">{t("standings.title")}</h1>
        <p className="text-muted text-sm">{t("standings.subtitle")}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-green inline-block" /> {t("standings.qualified")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue inline-block" /> {t("standings.bestThird")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-red inline-block" /> {t("standings.eliminated")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(standings).map(([letter, table]) => (
          <div key={letter} className="rounded-xl border border-border bg-card p-4 overflow-x-auto">
            <h2 className="font-bold mb-3">{t("home.group")} {letter}</h2>
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-muted text-left border-b border-border">
                  <th className="py-1 pr-2">Team</th>
                  <th className="px-1 text-center">P</th>
                  <th className="px-1 text-center">W</th>
                  <th className="px-1 text-center">D</th>
                  <th className="px-1 text-center">L</th>
                  <th className="px-1 text-center">GF</th>
                  <th className="px-1 text-center">GA</th>
                  <th className="px-1 text-center">GD</th>
                  <th className="px-1 text-center">Pts</th>
                  <th className="px-1 text-center">xG</th>
                  <th className="px-1 text-center">ELO</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => (
                  <tr key={row.teamId} className={statusStyles[row.status]}>
                    <td className="py-1.5 pr-2 font-medium whitespace-nowrap">
                      {row.flag} {row.name}
                    </td>
                    <td className="px-1 text-center">{row.played}</td>
                    <td className="px-1 text-center">{row.won}</td>
                    <td className="px-1 text-center">{row.drawn}</td>
                    <td className="px-1 text-center">{row.lost}</td>
                    <td className="px-1 text-center">{row.goalsFor}</td>
                    <td className="px-1 text-center">{row.goalsAgainst}</td>
                    <td className="px-1 text-center">{row.goalDiff}</td>
                    <td className="px-1 text-center font-bold">{row.points}</td>
                    <td className="px-1 text-center">{row.xg.toFixed(2)}</td>
                    <td className="px-1 text-center">{row.elo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
