"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface StoredUser {
  username: string;
  passwordHash: string;
}

interface AuthContextValue {
  user: string | null;
  signup: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "wc2026-users";
const SESSION_KEY = "wc2026-session";

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists in the browser, so this runs after hydration.
    setUser(localStorage.getItem(SESSION_KEY));
  }, []);

  async function signup(username: string, password: string) {
    const trimmed = username.trim();
    if (!trimmed || !password) return { ok: false, error: "required" };

    const users = loadUsers();
    if (users.some((u) => u.username.toLowerCase() === trimmed.toLowerCase())) {
      return { ok: false, error: "exists" };
    }

    const passwordHash = await hashPassword(password);
    users.push({ username: trimmed, passwordHash });
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, trimmed);
    setUser(trimmed);
    return { ok: true };
  }

  async function login(username: string, password: string) {
    const trimmed = username.trim();
    if (!trimmed || !password) return { ok: false, error: "required" };

    const users = loadUsers();
    const passwordHash = await hashPassword(password);
    const found = users.find(
      (u) => u.username.toLowerCase() === trimmed.toLowerCase() && u.passwordHash === passwordHash
    );
    if (!found) return { ok: false, error: "invalid" };

    localStorage.setItem(SESSION_KEY, found.username);
    setUser(found.username);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
