"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "de";

const dictionaries: Record<Lang, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.standings": "Standings",
    "nav.tips": "My Tips",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.logout": "Log out",
    "nav.tagline": "FIFA World Cup 2026 · USA · Canada · Mexico",

    "countdown.title": "Kickoff Countdown · June 11, 2026 · Estadio Azteca",
    "countdown.started": "The tournament has kicked off!",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "countdown.seconds": "Seconds",

    "home.today": "Today's Matches",
    "home.fullSchedule": "Full Tournament Schedule",
    "home.date": "Date",
    "home.group": "Group",
    "home.stage": "Stage",
    "home.allDates": "All Dates",
    "home.allGroups": "All Groups",
    "home.allStages": "All Stages",
    "home.reset": "Reset Filters",
    "home.noMatches": "No matches match the selected filters.",
    "home.predict": "Predict",
    "home.modelFavors": "Model favors",
    "home.draw": "Draw",

    "predict.winProbability": "Win Probability",
    "predict.refresh": "🔄 Refresh Prediction (varies form slightly)",
    "predict.expectedGoalsHome": "Expected Goals (Home)",
    "predict.expectedGoalsAway": "Expected Goals (Away)",
    "predict.confidence": "Confidence",
    "predict.mostLikely": "Most Likely Scorelines",
    "predict.modelBreakdown": "Model Breakdown",
    "predict.heatmap": "Score Probability Heatmap",
    "predict.expertAnalysis": "Expert Analysis",
    "predict.askClaude": "🤖 Ask Claude",
    "predict.asking": "Asking Claude...",
    "predict.analysisPlaceholder": "Get a 3-paragraph expert breakdown of this matchup powered by Claude.",
    "predict.myPrediction": "My Prediction",
    "predict.win": "Win",
    "predict.saved": "Saved to My Tips ✓",
    "predict.notFound": "Match not found",
    "predict.backToSchedule": "Back to schedule",
    "predict.tbdTitle": "This fixture is still to be determined",
    "predict.tbdBody":
      "This fixture depends on group stage / earlier knockout results that haven't been determined yet. Check back once the qualifying teams are confirmed.",
    "predict.teamFacts": "Team Facts",
    "predict.funFacts": "Fun Facts (Football History)",
    "predict.fifaRank": "FIFA Rank",

    "standings.title": "Group Standings",
    "standings.subtitle":
      "Simulated table based on the prediction engine's expected goals for every group stage match.",
    "standings.qualified": "Qualified (Top 2)",
    "standings.bestThird": "Best 3rd Place",
    "standings.eliminated": "Eliminated",

    "tips.title": "My Tips",
    "tips.subtitle": "Predictions you save are stored locally in your browser. Track your accuracy here.",
    "tips.correct": "Correct",
    "tips.wrong": "Wrong",
    "tips.pending": "Pending",
    "tips.points": "Points",
    "tips.empty": "You haven't saved any predictions yet.",
    "tips.browse": "Browse matches",
    "tips.clearAll": "Clear all tips",
    "tips.remove": "Remove",
    "tips.yourPick": "Your pick",

    "auth.login": "Log in",
    "auth.signup": "Sign up",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.loginButton": "Log in",
    "auth.signupButton": "Create account",
    "auth.haveAccount": "Already have an account? Log in",
    "auth.needAccount": "Need an account? Sign up",
    "auth.welcome": "Welcome",
    "auth.errorExists": "That username is already taken.",
    "auth.errorInvalid": "Invalid username or password.",
    "auth.errorRequired": "Username and password are required.",
    "auth.title": "Account",
    "auth.loggedInAs": "Logged in as",

    "footer.text": "Predictions from Dixon-Coles, ELO, form and head-to-head · Built by Abdullah Al-Hakimi",
  },
  de: {
    "nav.home": "Startseite",
    "nav.standings": "Tabellen",
    "nav.tips": "Meine Tipps",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    "nav.logout": "Abmelden",
    "nav.tagline": "FIFA Fußball-Weltmeisterschaft 2026 · USA · Kanada · Mexiko",

    "countdown.title": "Countdown zum Anpfiff · 11. Juni 2026 · Estadio Azteca",
    "countdown.started": "Das Turnier hat begonnen!",
    "countdown.days": "Tage",
    "countdown.hours": "Stunden",
    "countdown.minutes": "Minuten",
    "countdown.seconds": "Sekunden",

    "home.today": "Heutige Spiele",
    "home.fullSchedule": "Gesamter Spielplan",
    "home.date": "Datum",
    "home.group": "Gruppe",
    "home.stage": "Runde",
    "home.allDates": "Alle Termine",
    "home.allGroups": "Alle Gruppen",
    "home.allStages": "Alle Runden",
    "home.reset": "Filter zurücksetzen",
    "home.noMatches": "Keine Spiele entsprechen den ausgewählten Filtern.",
    "home.predict": "Tippen",
    "home.modelFavors": "Modell favorisiert",
    "home.draw": "Unentschieden",

    "predict.winProbability": "Siegwahrscheinlichkeit",
    "predict.refresh": "🔄 Vorhersage aktualisieren (variiert die Form leicht)",
    "predict.expectedGoalsHome": "Erwartete Tore (Heim)",
    "predict.expectedGoalsAway": "Erwartete Tore (Auswärts)",
    "predict.confidence": "Konfidenz",
    "predict.mostLikely": "Wahrscheinlichste Ergebnisse",
    "predict.modelBreakdown": "Modell-Aufschlüsselung",
    "predict.heatmap": "Ergebnis-Wahrscheinlichkeits-Heatmap",
    "predict.expertAnalysis": "Expertenanalyse",
    "predict.askClaude": "🤖 Claude fragen",
    "predict.asking": "Claude wird gefragt...",
    "predict.analysisPlaceholder": "Hol dir eine dreiteilige Expertenanalyse zu diesem Spiel, powered by Claude.",
    "predict.myPrediction": "Meine Vorhersage",
    "predict.win": "Sieg",
    "predict.saved": "In Meine Tipps gespeichert ✓",
    "predict.notFound": "Spiel nicht gefunden",
    "predict.backToSchedule": "Zurück zum Spielplan",
    "predict.tbdTitle": "Diese Begegnung steht noch nicht fest",
    "predict.tbdBody":
      "Diese Begegnung hängt von Ergebnissen der Gruppenphase bzw. früheren K.-o.-Runden ab, die noch nicht feststehen. Schau später noch einmal vorbei.",
    "predict.teamFacts": "Team-Fakten",
    "predict.funFacts": "Wissenswertes (Fußballgeschichte)",
    "predict.fifaRank": "FIFA-Rang",

    "standings.title": "Gruppentabellen",
    "standings.subtitle":
      "Simulierte Tabelle basierend auf den erwarteten Toren (xG) des Vorhersagemodells für jedes Gruppenspiel.",
    "standings.qualified": "Qualifiziert (Top 2)",
    "standings.bestThird": "Beste Gruppendritte",
    "standings.eliminated": "Ausgeschieden",

    "tips.title": "Meine Tipps",
    "tips.subtitle": "Gespeicherte Vorhersagen werden lokal in deinem Browser gespeichert. Verfolge hier deine Trefferquote.",
    "tips.correct": "Richtig",
    "tips.wrong": "Falsch",
    "tips.pending": "Offen",
    "tips.points": "Punkte",
    "tips.empty": "Du hast noch keine Vorhersagen gespeichert.",
    "tips.browse": "Spiele durchsuchen",
    "tips.clearAll": "Alle Tipps löschen",
    "tips.remove": "Entfernen",
    "tips.yourPick": "Dein Tipp",

    "auth.login": "Anmelden",
    "auth.signup": "Registrieren",
    "auth.username": "Benutzername",
    "auth.password": "Passwort",
    "auth.loginButton": "Anmelden",
    "auth.signupButton": "Konto erstellen",
    "auth.haveAccount": "Schon ein Konto? Anmelden",
    "auth.needAccount": "Noch kein Konto? Registrieren",
    "auth.welcome": "Willkommen",
    "auth.errorExists": "Dieser Benutzername ist bereits vergeben.",
    "auth.errorInvalid": "Ungültiger Benutzername oder Passwort.",
    "auth.errorRequired": "Benutzername und Passwort sind erforderlich.",
    "auth.title": "Konto",
    "auth.loggedInAs": "Angemeldet als",

    "footer.text": "Vorhersagen aus Dixon-Coles, ELO, Form und direkten Duellen · Erstellt von Abdullah Al-Hakimi",
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LANG_KEY = "wc2026-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY) as Lang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists in the browser, so this runs after hydration.
    if (stored === "en" || stored === "de") setLangState(stored);
  }, []);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  }

  function t(key: string): string {
    return dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
  }

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
