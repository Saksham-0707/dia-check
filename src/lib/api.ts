import { clearAuthSession, getAuthToken, type AuthSession } from "@/lib/auth";

export interface PredictionInput {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

export interface DiabetesRecord extends PredictionInput {
  id: number;
  userId: number;
  predictionResult: "Diabetic" | "Not Diabetic";
  createdAt: string;
}

export interface PredictionResponse extends PredictionInput {
  predictionResult: "Diabetic" | "Not Diabetic";
  createdAt: string;
  saved: boolean;
  id?: number;
  userId?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

async function request<T>(
  path: string,
  init?: RequestInit,
  requiresAuth = false,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (requiresAuth) {
    const token = getAuthToken();

    if (!token) {
      throw new Error("You need to log in first.");
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
    }

    throw new Error(payload?.message || "Request failed.");
  }

  return payload as T;
}

export function signup(input: {
  name: string;
  email: string;
  password: string;
}) {
  return request<AuthSession>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: { email: string; password: string }) {
  return request<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createPrediction(input: PredictionInput) {
  return request<PredictionResponse>(
    "/diabetes/predict",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    true,
  );
}

export function getPredictionHistory() {
  return request<DiabetesRecord[]>("/diabetes/history", undefined, true);
}

export function getPredictionById(id: number) {
  return request<DiabetesRecord>(`/diabetes/${id}`, undefined, true);
}

export function updateConsent() {
  return request<{ message: string; user: AuthSession["user"] }>(
    "/user/consent",
    {
      method: "POST",
    },
    true,
  );
}
