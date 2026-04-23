-- CreateTable
CREATE TABLE "Prediction" (
    "id" SERIAL NOT NULL,
    "HbA1c" DOUBLE PRECISION NOT NULL,
    "Age" INTEGER NOT NULL,
    "BMI" DOUBLE PRECISION NOT NULL,
    "QualityOfLifeScore" DOUBLE PRECISION NOT NULL,
    "FrequentUrination" TEXT NOT NULL,
    "Hypertension" TEXT NOT NULL,
    "ExcessiveThirst" TEXT NOT NULL,
    "UnexplainedWeightLoss" TEXT NOT NULL,
    "FatigueLevels" TEXT NOT NULL,
    "BlurredVision" TEXT NOT NULL,
    "SlowHealingSores" TEXT NOT NULL,
    "TinglingHandsFeet" TEXT NOT NULL,
    "SleepQuality" TEXT NOT NULL,
    "PhysicalActivity" TEXT NOT NULL,
    "DietQuality" TEXT NOT NULL,
    "AlcoholConsumption" TEXT NOT NULL,
    "EducationLevel" TEXT NOT NULL,
    "SocioeconomicStatus" TEXT NOT NULL,
    "HealthLiteracy" TEXT NOT NULL,
    "Ethnicity" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,
    "FamilyHistoryDiabetes" TEXT NOT NULL,
    "PreviousPreDiabetes" TEXT NOT NULL,
    "GestationalDiabetes" TEXT NOT NULL,
    "PolycysticOvarySyndrome" TEXT NOT NULL,
    "MedicalCheckupsFrequency" TEXT NOT NULL,
    "WaterQuality" TEXT NOT NULL,
    "OccupationalExposureChemicals" TEXT NOT NULL,
    "prediction" INTEGER NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "explanation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prediction_createdAt_idx" ON "Prediction"("createdAt");
