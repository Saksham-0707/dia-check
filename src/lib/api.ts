import { clearAuthSession, getAuthToken, type AuthSession } from "@/lib/auth";

export type PredictionInput = Record<string, number>;

export interface ShapExplanation {
  feature: string;
  impact: number;
}

export interface PredictionRecord {
  id: number;
  HbA1c: number;
  Age: number;
  BMI: number;
  QualityOfLifeScore: number;
  FrequentUrination: string;
  Hypertension: string;
  ExcessiveThirst: string;
  UnexplainedWeightLoss: string;
  FatigueLevels: string;
  BlurredVision: string;
  SlowHealingSores: string;
  TinglingHandsFeet: string;
  SleepQuality: string;
  PhysicalActivity: string;
  DietQuality: string;
  AlcoholConsumption: string;
  EducationLevel: string;
  SocioeconomicStatus: string;
  HealthLiteracy: string;
  Ethnicity: string;
  Gender: string;
  FamilyHistoryDiabetes: string;
  PreviousPreDiabetes: string;
  GestationalDiabetes: string;
  PolycysticOvarySyndrome: string;
  MedicalCheckupsFrequency: string;
  WaterQuality: string;
  OccupationalExposureChemicals: string;
  prediction: number;
  probability: number;
  threshold: number;
  explanation?: ShapExplanation[] | null;
  createdAt: string;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  threshold: number;
  explanation: ShapExplanation[];
  createdAt?: string;
  saved?: boolean;
  id?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

function getAuthenticatedApiHeaders() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You need to log in first.");
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

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

export function createPrediction(input: PredictionInput, saveResult = false) {
  const headers = getAuthenticatedApiHeaders();
  headers.set("X-Save-Result", saveResult ? "true" : "false");

  return fetch("/api/predict", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  }).then(async (response) => {
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Prediction failed.");
    }

    return payload as PredictionResponse;
  });
}

export function getPredictionHistory() {
  const headers = getAuthenticatedApiHeaders();

  return fetch("/api/history", { headers }).then(async (response) => {
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to load prediction history.");
    }

    return payload as PredictionRecord[];
  });
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
