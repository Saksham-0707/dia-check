import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";

const FASTAPI_PREDICT_URL =
  process.env.PYTHON_PREDICT_URL || "http://127.0.0.1:8000/predict";

const modelFieldRanges = {
  HbA1c: { min: 4, max: 10 },
  Age: { min: 20, max: 90 },
  BMI: { min: 15, max: 40 },
  FrequentUrination: { min: 0, max: 1 },
  Hypertension: { min: 0, max: 1 },
  ExcessiveThirst: { min: 0, max: 1 },
  UnexplainedWeightLoss: { min: 0, max: 1 },
  FatigueLevels: { min: 0, max: 10 },
  BlurredVision: { min: 0, max: 1 },
  SlowHealingSores: { min: 0, max: 1 },
  TinglingHandsFeet: { min: 0, max: 1 },
  SleepQuality: { min: 4, max: 10 },
  PhysicalActivity: { min: 0, max: 10 },
  DietQuality: { min: 0, max: 10 },
  AlcoholConsumption: { min: 0, max: 20 },
  EducationLevel: { min: 0, max: 3 },
  SocioeconomicStatus: { min: 0, max: 2 },
  HealthLiteracy: { min: 0, max: 10 },
  QualityOfLifeScore: { min: 0, max: 100 },
  Ethnicity: { min: 0, max: 3 },
  Gender: { min: 0, max: 1 },
  FamilyHistoryDiabetes: { min: 0, max: 1 },
  PreviousPreDiabetes: { min: 0, max: 1 },
  GestationalDiabetes: { min: 0, max: 1 },
  PolycysticOvarySyndrome: { min: 0, max: 1 },
  MedicalCheckupsFrequency: { min: 0, max: 4 },
  WaterQuality: { min: 0, max: 1 },
  OccupationalExposureChemicals: { min: 0, max: 1 },
} as const;

const integerFields = new Set([
  "Age",
  "FrequentUrination",
  "Hypertension",
  "ExcessiveThirst",
  "UnexplainedWeightLoss",
  "FatigueLevels",
  "BlurredVision",
  "SlowHealingSores",
  "TinglingHandsFeet",
  "SleepQuality",
  "PhysicalActivity",
  "DietQuality",
  "AlcoholConsumption",
  "EducationLevel",
  "SocioeconomicStatus",
  "HealthLiteracy",
  "Ethnicity",
  "Gender",
  "FamilyHistoryDiabetes",
  "PreviousPreDiabetes",
  "GestationalDiabetes",
  "PolycysticOvarySyndrome",
  "MedicalCheckupsFrequency",
  "WaterQuality",
  "OccupationalExposureChemicals",
]);

const stringStorageFields = [
  "FrequentUrination",
  "Hypertension",
  "ExcessiveThirst",
  "UnexplainedWeightLoss",
  "FatigueLevels",
  "BlurredVision",
  "SlowHealingSores",
  "TinglingHandsFeet",
  "SleepQuality",
  "PhysicalActivity",
  "DietQuality",
  "AlcoholConsumption",
  "EducationLevel",
  "SocioeconomicStatus",
  "HealthLiteracy",
  "Ethnicity",
  "Gender",
  "FamilyHistoryDiabetes",
  "PreviousPreDiabetes",
  "GestationalDiabetes",
  "PolycysticOvarySyndrome",
  "MedicalCheckupsFrequency",
  "WaterQuality",
  "OccupationalExposureChemicals",
] as const;

type ModelField = keyof typeof modelFieldRanges;
type PredictionPayload = Record<ModelField, number>;

type FastApiPrediction = {
  prediction: number;
  probability: number;
  threshold: number;
  explanation?: Array<{
    feature: string;
    impact: number;
  }>;
};

function shouldSaveResult(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return false;
  }

  return (input as Record<string, unknown>).saveResult === true;
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

function validatePayload(input: unknown): PredictionPayload | NextResponse {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return badRequest("Request body must be a JSON object.");
  }

  const body = input as Record<string, unknown>;
  const payload = {} as PredictionPayload;

  for (const [field, range] of Object.entries(modelFieldRanges) as [
    ModelField,
    { min: number; max: number },
  ][]) {
    if (!(field in body)) {
      return badRequest(`${field} is required.`);
    }

    if (typeof body[field] !== "number") {
      return badRequest(`${field} must be a number.`);
    }

    const value = body[field];
    if (!Number.isFinite(value)) {
      return badRequest(`${field} must be a valid number.`);
    }

    if (value < range.min || value > range.max) {
      return badRequest(`${field} must be between ${range.min} and ${range.max}.`);
    }

    if (integerFields.has(field) && !Number.isInteger(value)) {
      return badRequest(`${field} must be a whole number.`);
    }

    payload[field] = value;
  }

  return payload;
}

export async function POST(request: Request) {
  try {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const saveResult =
      request.headers.get("X-Save-Result") === "true" || shouldSaveResult(body);
    const payload = validatePayload(body);

    if (payload instanceof NextResponse) {
      return payload;
    }

    const response = await fetch(FASTAPI_PREDICT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.detail || data?.message || "Prediction API request failed." },
        { status: response.status },
      );
    }

    const predictionData = data as FastApiPrediction;

    if (
      !Number.isInteger(predictionData.prediction) ||
      !Number.isFinite(predictionData.probability) ||
      !Number.isFinite(predictionData.threshold)
    ) {
      return NextResponse.json(
        { message: "Prediction API returned an invalid response." },
        { status: 502 },
      );
    }

    if (!saveResult) {
      return NextResponse.json({
        ...predictionData,
        saved: false,
      });
    }

    const stringStorageData = stringStorageFields.reduce(
      (current, field) => {
        current[field] = String(payload[field]);
        return current;
      },
      {} as Record<(typeof stringStorageFields)[number], string>,
    );

    const savedPrediction = await prisma.prediction.create({
      data: {
        userId: user.id,
        HbA1c: payload.HbA1c,
        Age: payload.Age,
        BMI: payload.BMI,
        QualityOfLifeScore: payload.QualityOfLifeScore,
        ...stringStorageData,
        prediction: predictionData.prediction,
        probability: predictionData.probability,
        threshold: predictionData.threshold,
        explanation: predictionData.explanation ?? undefined,
      },
    });

    return NextResponse.json({
      ...predictionData,
      id: savedPrediction.id,
      createdAt: savedPrediction.createdAt,
      saved: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to reach prediction API.",
      },
      { status: 500 },
    );
  }
}
