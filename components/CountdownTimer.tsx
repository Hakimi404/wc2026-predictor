"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

const TARGET = new Date("2026-06-11T16:00:00Z").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: t("countdown.days"), value: timeLeft?.days ?? 0 },
    { label: t("countdown.hours"), value: timeLeft?.hours ?? 0 },
    { label: t("countdown.minutes"), value: timeLeft?.minutes ?? 0 },
    { label: t("countdown.seconds"), value: timeLeft?.seconds ?? 0 },
  ];

  const started = timeLeft && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted mb-3 uppercase tracking-widest">
        {started ? t("countdown.started") : t("countdown.title")}
      </p>
      <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
        {units.map((u) => (
          <div key={u.label} className="rounded-lg border border-border bg-background p-3">
            <div className="text-2xl sm:text-4xl font-bold text-gold tabular-nums">
              {String(u.value).padStart(2, "0")}
            </div>
            <div className="text-xs text-muted mt-1">{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
