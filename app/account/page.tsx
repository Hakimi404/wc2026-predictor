"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export default function AccountPage() {
  const { user, login, signup, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 space-y-4 text-center">
        <h1 className="text-2xl font-bold">{t("auth.title")}</h1>
        <p className="text-muted">
          {t("auth.loggedInAs")} <span className="font-semibold text-foreground">{user}</span>
        </p>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-red hover:text-red transition-colors"
        >
          {t("nav.logout")}
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError(t("auth.errorRequired"));
      return;
    }

    const result = mode === "login" ? await login(username, password) : await signup(username, password);

    if (!result.ok) {
      if (result.error === "exists") setError(t("auth.errorExists"));
      else if (result.error === "invalid") setError(t("auth.errorInvalid"));
      else setError(t("auth.errorRequired"));
      return;
    }

    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">{mode === "login" ? t("auth.login") : t("auth.signup")}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted">{t("auth.username")}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm"
              autoComplete="username"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted">{t("auth.password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && <p className="text-red text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-accent hover:bg-accent/80 transition-colors text-white text-sm font-semibold py-2"
          >
            {mode === "login" ? t("auth.loginButton") : t("auth.signupButton")}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
          }}
          className="w-full text-center text-sm text-accent hover:underline"
        >
          {mode === "login" ? t("auth.needAccount") : t("auth.haveAccount")}
        </button>
      </div>
    </div>
  );
}
