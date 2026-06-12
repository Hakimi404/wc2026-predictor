"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getMatch } from "@/lib/schedule";
import { getTeam, getTeamFacts, getFunFacts } from "@/lib/teams";
import { predictMatch, predictMatchWithSeed, Prediction } from "@/lib/prediction";
import ProbabilityBar from "@/components/ProbabilityBar";
import Heatmap from "@/components/Heatmap";
import ModelBreakdown from "@/components/ModelBreakdown";
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

export default function PredictPage() {
  const { t, lang } = useLanguage();
  const params = useParams<{ matchId: string }>();
  const matchId = params.matchId;
  const match = getMatch(matchId);

  const home = match ? getTeam(match.homeTeam) : undefined;
  const away = match ? getTeam(match.awayTeam) : undefined;

  const basePrediction = useMemo(() => {
    if (!home || !away) return null;
    return predictMatch(home.id, away.id);
  }, [home, away]);

  const [prediction, setPrediction] = useState<Prediction | null>(basePrediction);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [pick, setPick] = useState<Pick | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrediction(basePrediction);
  }, [basePrediction]);

  useEffect(() => {
    if (!match) return;
    try {
      const raw = localStorage.getItem(TIPS_KEY);
      const tips: SavedTip[] = raw ? JSON.parse(raw) : [];
      const existing = tips.find((t) => t.matchId === match.matchId);
      if (existing) {
        setPick(existing.pick);
        setSaved(true);
      }
    } catch {
      // ignore
    }
  }, [match]);

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">{t("predict.notFound")}</h1>
        <Link href="/" className="text-accent hover:underline">
          {t("predict.backToSchedule")}
        </Link>
      </div>
    );
  }

  if (!home || !away || !prediction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">{match.homeTeam} vs {match.awayTeam}</h1>
        <p className="text-muted">
          {match.stage} · {match.date} · {match.venue}, {match.city}
        </p>
        <p className="text-muted">{t("predict.tbdBody")}</p>
        <Link href="/" className="text-accent hover:underline">
          {t("predict.backToSchedule")}
        </Link>
      </div>
    );
  }

  const homeFacts = getTeamFacts(home, lang);
  const awayFacts = getTeamFacts(away, lang);

  function refreshPrediction() {
    if (!home || !away) return;
    const seed = Math.floor(Math.random() * 1_000_000);
    const updated = predictMatchWithSeed(home.id, away.id, seed);
    if (updated) setPrediction(updated);
  }

  async function askClaude() {
    if (!home || !away) return;
    setLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeTeam: home.id, awayTeam: away.id }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setAnalysis(data.analysis ?? "No analysis returned.");
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Failed to fetch analysis");
    } finally {
      setLoadingAnalysis(false);
    }
  }

  function savePick(newPick: Pick) {
    setPick(newPick);
    setSaved(true);
    try {
      const raw = localStorage.getItem(TIPS_KEY);
      const tips: SavedTip[] = raw ? JSON.parse(raw) : [];
      const filtered = tips.filter((t) => t.matchId !== match!.matchId);
      filtered.push({
        matchId: match!.matchId,
        homeTeam: match!.homeTeam,
        awayTeam: match!.awayTeam,
        pick: newPick,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem(TIPS_KEY, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 fade-in">
      <div className="text-center space-y-1">
        <p className="text-sm text-muted">
          {match.group ? `Group ${match.group} · ` : `${match.stage} · `}
          {match.date} · {match.time} CEST (German time) · {match.venue}, {match.city}
        </p>
      </div>

      {/* Team header */}
      <div className="grid grid-cols-3 items-center gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-5xl">{home.flag}</span>
          <span className="font-bold mt-2">{home.name}</span>
          <span className="text-xs text-muted">{t("predict.fifaRank")} #{home.fifa_rank}</span>
        </div>
        <div className="text-center text-muted font-bold text-lg">VS</div>
        <div className="flex flex-col items-center text-center">
          <span className="text-5xl">{away.flag}</span>
          <span className="font-bold mt-2">{away.name}</span>
          <span className="text-xs text-muted">{t("predict.fifaRank")} #{away.fifa_rank}</span>
        </div>
      </div>

      {/* Team facts */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-bold mb-4">{t("predict.teamFacts")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-xl">{home.flag}</span> {home.name}
            </h3>
            <ul className="space-y-1.5 text-sm text-muted list-disc list-inside">
              {homeFacts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-xl">{away.flag}</span> {away.name}
            </h3>
            <ul className="space-y-1.5 text-sm text-muted list-disc list-inside">
              {awayFacts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fun facts */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-bold mb-4">{t("predict.funFacts")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-xl">{home.flag}</span> {home.name}
            </h3>
            <ul className="space-y-1.5 text-sm text-muted list-disc list-inside">
              {getFunFacts(home).map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-xl">{away.flag}</span> {away.name}
            </h3>
            <ul className="space-y-1.5 text-sm text-muted list-disc list-inside">
              {getFunFacts(away).map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Win probability bars */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{t("predict.winProbability")}</h2>
          <button
            onClick={refreshPrediction}
            className="text-xs rounded border border-border px-3 py-1 hover:border-accent hover:text-accent transition-colors"
          >
            {t("predict.refresh")}
          </button>
        </div>
        <ProbabilityBar label={`${home.name} ${t("predict.win")}`} value={prediction.win_a} color="blue" />
        <ProbabilityBar label={t("home.draw")} value={prediction.draw} color="grey" />
        <ProbabilityBar label={`${away.name} ${t("predict.win")}`} value={prediction.win_b} color="red" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-center">
          <div>
            <div className="text-xs text-muted">{t("predict.expectedGoalsHome")} ({home.name})</div>
            <div className="text-2xl font-bold text-gold">{prediction.xg_a.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted">{t("predict.expectedGoalsAway")} ({away.name})</div>
            <div className="text-2xl font-bold text-gold">{prediction.xg_b.toFixed(2)}</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-xs text-muted">{t("predict.confidence")}</div>
            <div className="text-2xl font-bold">{prediction.confidence}%</div>
            <div className="h-2 mt-1 rounded-full bg-background border border-border overflow-hidden">
              <div
                className="prob-bar h-full bg-accent"
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Most likely scorelines */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-bold mb-4">{t("predict.mostLikely")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {prediction.most_likely_score.map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-background p-3 text-center"
            >
              <div className="text-xl font-bold">
                {s.home} - {s.away}
              </div>
              <div className="text-xs text-muted mt-1">{(s.prob * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Model breakdown */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-bold mb-4">{t("predict.modelBreakdown")}</h2>
        <ModelBreakdown breakdown={prediction.breakdown} homeName={home.name} awayName={away.name} />
      </div>

      {/* Heatmap */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-bold mb-4">{t("predict.heatmap")}</h2>
        <Heatmap matrix={prediction.score_matrix} homeLabel={home.name} awayLabel={away.name} />
      </div>

      {/* Ask Claude */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-bold">{t("predict.expertAnalysis")}</h2>
          <button
            onClick={askClaude}
            disabled={loadingAnalysis}
            className="rounded-lg bg-accent hover:bg-accent/80 transition-colors text-white text-sm font-semibold px-4 py-2 disabled:opacity-50"
          >
            {loadingAnalysis ? t("predict.asking") : t("predict.askClaude")}
          </button>
        </div>
        {analysisError && <p className="text-red text-sm">{analysisError}</p>}
        {analysis && (
          <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line space-y-3">
            {analysis}
          </div>
        )}
        {!analysis && !analysisError && !loadingAnalysis && (
          <p className="text-muted text-sm">{t("predict.analysisPlaceholder")}</p>
        )}
      </div>

      {/* Save tip */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="font-bold">{t("predict.myPrediction")}</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => savePick("home")}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              pick === "home" ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-accent"
            }`}
          >
            {home.name} {t("predict.win")}
          </button>
          <button
            onClick={() => savePick("draw")}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              pick === "draw" ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-accent"
            }`}
          >
            {t("home.draw")}
          </button>
          <button
            onClick={() => savePick("away")}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              pick === "away" ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-accent"
            }`}
          >
            {away.name} {t("predict.win")}
          </button>
        </div>
        {saved && <p className="text-xs text-green">{t("predict.saved")}</p>}
      </div>
    </div>
  );
}
