import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

function formatFeatureImpact(item: { feature: string; impact: number }) {
  const direction = item.impact >= 0 ? "increased risk" : "reduced risk";
  return `${item.feature} ${direction}`;
}

function createFallbackExplanation(data: FastApiPrediction) {
  const prediction = data.prediction === 1 ? "an elevated diabetes risk" : "no elevated diabetes risk";
  const probability = (data.probability * 100).toFixed(1);
  const features = (data.explanation ?? []).slice(0, 3).map(formatFeatureImpact);
  const factorText = features.length
    ? ` Key factors were: ${features.join(", ")}.`
    : "";

  return `The model found ${prediction} with a ${probability}% probability.${factorText} Keep healthy habits like regular activity, balanced meals, and follow up with a healthcare professional for personal advice.`;
}

function isUsableExplanation(text: string) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  const blockedResponses = new Set([
    "hello",
    "hello there",
    "hi",
    "hi there",
    "hey",
  ]);

  return !blockedResponses.has(normalized) && normalized.split(/\s+/).length >= 12;
}

async function generateExplanation(data: FastApiPrediction) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return createFallbackExplanation(data);
  }

  const modelNames = [
    process.env.GEMINI_MODEL,
    "gemini-2.5-flash",
  ].filter((modelName, index, modelList): modelName is string => {
    return Boolean(modelName) && modelList.indexOf(modelName) === index;
  });

  const prediction = data.prediction === 1 ? "Diabetic" : "Not Diabetic";
  const probability = (data.probability * 100).toFixed(1);
  const topFeatures = (data.explanation ?? [])
    .slice(0, 3)
    .map((item) => {
      const direction = item.impact >= 0 ? "increases risk" : "reduces risk";
      return `${item.feature} (${direction})`;
    })
    .join("\n");

  const prompt = `You are a friendly health assistant.

A user received a diabetes risk prediction.

Result: ${prediction}
Risk Probability: ${probability}%

Top factors affecting this result:
${topFeatures || "No high impact factors available."}

Explain clearly and simply:
- What this means
- Which factors increased the risk
- Which factors (if any) reduced the risk
- Give 1-2 simple lifestyle suggestions

Rules:
- Keep it under 80 words
- Use simple, non-technical language
- Be calm and supportive (not scary)
- Do NOT start with a greeting
- Do NOT give medical diagnosis or treatment`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError: unknown;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            maxOutputTokens: 120,
            temperature: 0.3,
          },
        });
        const result = await model.generateContent(prompt);

        const explanation = result.response.text().trim();

        if (isUsableExplanation(explanation)) {
          return explanation;
        }

        console.warn(`Gemini model ${modelName} returned an unusable explanation.`);
      } catch (error) {
        lastError = error;
        console.warn(`Gemini model ${modelName} failed. Trying fallback if available.`);
      }
    }

    console.warn("Gemini explanation failed:", lastError);
    return createFallbackExplanation(data);
  } catch (error) {
    console.warn("Gemini explanation failed:", error);
    return createFallbackExplanation(data);
  }
}

function shouldSaveResult(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return false;
  }

  return (input as Record<string, unknown>).saveResult === true;
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

function logServerError(context: string, error: unknown) {
  console.error(context, error);
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

    const humanExplanation = await generateExplanation(predictionData);

    if (!saveResult) {
      return NextResponse.json({
        ...predictionData,
        humanExplanation,
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

    const savedPrediction = await prisma.prediction
      .create({
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
      })
      .catch((error) => {
        logServerError("Failed to save prediction result.", error);
        return null;
      });

    if (!savedPrediction) {
      return NextResponse.json({
        ...predictionData,
        humanExplanation,
        saved: false,
      });
    }

    return NextResponse.json({
      ...predictionData,
      humanExplanation,
      id: savedPrediction.id,
      createdAt: savedPrediction.createdAt,
      saved: true,
    });
  } catch (error) {
    logServerError("Prediction request failed.", error);

    return NextResponse.json(
      {
        message: "Something went wrong while creating your prediction. Please try again.",
      },
      { status: 500 },
    );
  }
}
