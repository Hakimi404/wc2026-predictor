"use client";

import { useMemo, useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import MatchCard from "@/components/MatchCard";
import { schedule, groupLettersList, stages } from "@/lib/schedule";
import { useLanguage } from "@/lib/i18n";

const TODAY = "2026-06-11";

export default function Home() {
  const { t, lang } = useLanguage();
  const [dateFilter, setDateFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const allDates = useMemo(() => {
    const dates = Array.from(new Set(schedule.map((m) => m.date)));
    return dates.sort();
  }, []);

  const todaysMatches = useMemo(() => schedule.filter((m) => m.date === TODAY), []);

  const filteredMatches = useMemo(() => {
    return schedule.filter((m) => {
      if (dateFilter !== "all" && m.date !== dateFilter) return false;
      if (groupFilter !== "all" && m.group !== groupFilter) return false;
      if (stageFilter !== "all" && m.stage !== stageFilter) return false;
      return true;
    });
  }, [dateFilter, groupFilter, stageFilter]);

  const matchesByDate = useMemo(() => {
    const map = new Map<string, typeof schedule>();
    for (const match of filteredMatches) {
      if (!map.has(match.date)) map.set(match.date, []);
      map.get(match.date)!.push(match);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredMatches]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <CountdownTimer />

      {todaysMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-gold">●</span> {t("home.today")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {todaysMatches.map((m) => (
              <MatchCard key={m.matchId} match={m} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">{t("home.fullSchedule")}</h2>

        <div className="flex flex-wrap gap-3 mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">{t("home.date")}</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-background border border-border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t("home.allDates")}</option>
              {allDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">{t("home.group")}</label>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-background border border-border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t("home.allGroups")}</option>
              {groupLettersList.map((g) => (
                <option key={g} value={g}>
                  {t("home.group")} {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">{t("home.stage")}</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-background border border-border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t("home.allStages")}</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setDateFilter("all");
                setGroupFilter("all");
                setStageFilter("all");
              }}
              className="text-sm text-muted hover:text-foreground border border-border rounded px-3 py-1 transition-colors"
            >
              {t("home.reset")}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {matchesByDate.map(([date, matches]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted mb-3 border-b border-border pb-2">
                {new Date(date + "T00:00:00Z").toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {matches.map((m) => (
                  <MatchCard key={m.matchId} match={m} />
                ))}
              </div>
            </div>
          ))}
          {matchesByDate.length === 0 && (
            <p className="text-muted text-center py-8">{t("home.noMatches")}</p>
          )}
        </div>
      </section>
    </div>
  );
}
