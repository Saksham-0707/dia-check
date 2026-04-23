import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";

const FASTAPI_PREDICT_URL =
  process.env.PYTHON_PREDICT_URL || "http://127.0.0.1:8000/predict";

const numericFields = ["HbA1c", "Age", "BMI", "QualityOfLifeScore"] as const;

const categoricalFields = [
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

type NumericField = (typeof numericFields)[number];
type CategoricalField = (typeof categoricalFields)[number];

type PredictionPayload = Record<NumericField, number> &
  Record<CategoricalField, string>;

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

  for (const field of numericFields) {
    if (!(field in body)) {
      return badRequest(`${field} is required.`);
    }

    const value = Number(body[field]);
    if (!Number.isFinite(value)) {
      return badRequest(`${field} must be a valid number.`);
    }

    payload[field] = field === "Age" ? Math.trunc(value) : value;
  }

  for (const field of categoricalFields) {
    if (!(field in body)) {
      return badRequest(`${field} is required.`);
    }

    const value = body[field];
    if (typeof value !== "string" || value.trim() === "") {
      return badRequest(`${field} must be a non-empty string.`);
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
    const saveResult = shouldSaveResult(body);
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

    const savedPrediction = await prisma.prediction.create({
      data: {
        userId: user.id,
        ...payload,
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
