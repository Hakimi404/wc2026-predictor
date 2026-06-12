"use client";

import Link from "next/link";
import { Match } from "@/lib/schedule";
import { getTeam } from "@/lib/teams";
import { predictMatch } from "@/lib/prediction";
import { useLanguage } from "@/lib/i18n";

function formatDate(date: string, lang: string): string {
  return new Date(date + "T00:00:00Z").toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function MatchCard({ match }: { match: Match }) {
  const { t, lang } = useLanguage();
  const home = getTeam(match.homeTeam);
  const away = getTeam(match.awayTeam);
  const prediction = home && away ? predictMatch(match.homeTeam, match.awayTeam) : null;

  let predictedWinner: string | null = null;
  if (prediction && home && away) {
    if (prediction.win_a > prediction.win_b && prediction.win_a > prediction.draw) {
      predictedWinner = home.name;
    } else if (prediction.win_b > prediction.win_a && prediction.win_b > prediction.draw) {
      predictedWinner = away.name;
    } else {
      predictedWinner = t("home.draw");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:border-accent transition-colors hover:shadow-lg hover:shadow-accent/10">
      <div className="flex items-center justify-between text-xs text-muted mb-3">
        <span>
          {formatDate(match.date, lang)} · {match.time} CEST
        </span>
        <span className="rounded bg-background border border-border px-2 py-0.5">
          {match.group ? `Group ${match.group}` : match.stage}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-col items-center flex-1 min-w-0">
          <span className="text-3xl">{home?.flag ?? "🏳️"}</span>
          <span className="text-sm font-medium mt-1 text-center truncate w-full">
            {home?.name ?? match.homeTeam}
          </span>
        </div>
        <span className="text-muted text-sm font-bold px-2">vs</span>
        <div className="flex flex-col items-center flex-1 min-w-0">
          <span className="text-3xl">{away?.flag ?? "🏳️"}</span>
          <span className="text-sm font-medium mt-1 text-center truncate w-full">
            {away?.name ?? match.awayTeam}
          </span>
        </div>
      </div>

      <div className="text-xs text-muted text-center mb-3 truncate">
        📍 {match.venue}, {match.city}
      </div>

      {predictedWinner && (
        <div className="text-center mb-3">
          <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            {t("home.modelFavors")}: {predictedWinner}
          </span>
        </div>
      )}

      <Link
        href={`/predict/${match.matchId}`}
        className="block text-center rounded-lg bg-accent hover:bg-accent/80 transition-colors text-white text-sm font-semibold py-2"
      >
        {t("home.predict")}
      </Link>
    </div>
  );
}
