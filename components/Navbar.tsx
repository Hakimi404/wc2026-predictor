"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">
            🏆 WC2026 <span className="text-gold">Predictor</span>
          </span>
          <span className="text-xs text-muted">{t("nav.tagline")}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/standings" className="hover:text-accent transition-colors">
            {t("nav.standings")}
          </Link>
          <Link href="/tips" className="hover:text-accent transition-colors">
            {t("nav.tips")}
          </Link>

          <div className="flex items-center gap-1 rounded border border-border overflow-hidden text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 transition-colors ${lang === "en" ? "bg-accent text-white" : "hover:text-accent"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("de")}
              className={`px-2 py-1 transition-colors ${lang === "de" ? "bg-accent text-white" : "hover:text-accent"}`}
            >
              DE
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-muted text-xs">{user}</span>
              <button onClick={logout} className="hover:text-accent transition-colors">
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <Link href="/account" className="hover:text-accent transition-colors">
              {t("nav.login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
