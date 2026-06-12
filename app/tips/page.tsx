"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMatch } from "@/lib/schedule";
import { getTeam } from "@/lib/teams";
import { predictMatch } from "@/lib/prediction";
import { useLanguage } from "@/lib/i18n";

type Pick = "home" | "draw" | "away";

interface SavedTip {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  pick: Pick;
  savedAt: string;
}

const TIPS_KEY = "wc2026-tips";
const TODAY = "2026-06-11";

type Outcome = "correct" | "wrong" | "pending";

function evaluate(tip: SavedTip): Outcome {
  const match = getMatch(tip.matchId);
  if (!match) return "pending";
  if (match.date >= TODAY) return "pending";

  const prediction = predictMatch(tip.homeTeam, tip.awayTeam);
  if (!prediction) return "pending";

  let actual: Pick;
  if (prediction.win_a > prediction.win_b && prediction.win_a > prediction.draw) actual = "home";
  else if (prediction.win_b > prediction.win_a && prediction.win_b > prediction.draw) actual = "away";
  else actual = "draw";

  return tip.pick === actual ? "correct" : "wrong";
}

export default function TipsPage() {
  const { t } = useLanguage();
  const [tips, setTips] = useState<SavedTip[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TIPS_KEY);
      setTips(raw ? JSON.parse(raw) : []);
    } catch {
      setTips([]);
    }
  }, []);

  function removeTip(matchId: string) {
    const updated = tips.filter((t) => t.matchId !== matchId);
    setTips(updated);
    localStorage.setItem(TIPS_KEY, JSON.stringify(updated));
  }

  function clearAll() {
    setTips([]);
    localStorage.removeItem(TIPS_KEY);
  }

  const evaluated = tips.map((t) => ({ tip: t, outcome: evaluate(t) }));
  const correct = evaluated.filter((e) => e.outcome === "correct").length;
  const wrong = evaluated.filter((e) => e.outcome === "wrong").length;
  const pending = evaluated.filter((e) => e.outcome === "pending").length;
  const points = correct * 3;

  const outcomeStyles: Record<Outcome, string> = {
    correct: "bg-green/10 border-l-4 border-l-green text-green",
    wrong: "bg-red/10 border-l-4 border-l-red text-red",
    pending: "bg-card border-l-4 border-l-border text-muted",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">{t("tips.title")}</h1>
        <p className="text-muted text-sm">{t("tips.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green">{correct}</div>
          <div className="text-xs text-muted mt-1">{t("tips.correct")}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-red">{wrong}</div>
          <div className="text-xs text-muted mt-1">{t("tips.wrong")}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-muted">{pending}</div>
          <div className="text-xs text-muted mt-1">{t("tips.pending")}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-gold">{points}</div>
          <div className="text-xs text-muted mt-1">{t("tips.points")}</div>
        </div>
      </div>

      {tips.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted">
          {t("tips.empty")}{" "}
          <Link href="/" className="text-accent hover:underline">
            {t("tips.browse")}
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-3">
          {evaluated.map(({ tip, outcome }) => {
            const match = getMatch(tip.matchId);
            const home = getTeam(tip.homeTeam);
            const away = getTeam(tip.awayTeam);
            const pickLabel =
              tip.pick === "home"
                ? `${home?.name ?? tip.homeTeam} Win`
                : tip.pick === "away"
                ? `${away?.name ?? tip.awayTeam} Win`
                : "Draw";

            return (
              <div
                key={tip.matchId}
                className={`rounded-xl border border-border p-4 flex items-center justify-between gap-4 ${outcomeStyles[outcome]}`}
              >
                <div>
                  <div className="font-semibold text-foreground">
                    {home?.flag ?? "🏳️"} {home?.name ?? tip.homeTeam} vs {away?.name ?? tip.awayTeam}{" "}
                    {away?.flag ?? "🏳️"}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {match ? `${match.date} · ${match.stage}` : "Unknown match"} · {t("tips.yourPick")}:{" "}
                    <span className="font-medium">{pickLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase">{outcome}</span>
                  <button
                    onClick={() => removeTip(tip.matchId)}
                    className="text-xs text-muted hover:text-red transition-colors"
                  >
                    {t("tips.remove")}
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={clearAll}
            className="text-sm text-muted hover:text-red border border-border rounded px-3 py-1 transition-colors"
          >
            {t("tips.clearAll")}
          </button>
        </div>
      )}
    </div>
  );
}
