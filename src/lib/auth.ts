"use client";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

const AUTH_STORAGE_KEY = "diacheck_auth";

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("diacheck-auth-changed"));
  }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return getAuthSession()?.token ?? null;
}

export function getAuthUser() {
  return getAuthSession()?.user ?? null;
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    emitAuthChange();
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
