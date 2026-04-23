-- Baseline migration for the existing database schema.
-- This migration is marked as already applied so existing data is preserved.

CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "consent" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DiabetesRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pregnancies" INTEGER NOT NULL,
    "glucose" DOUBLE PRECISION NOT NULL,
    "bloodPressure" DOUBLE PRECISION NOT NULL,
    "skinThickness" DOUBLE PRECISION NOT NULL,
    "insulin" DOUBLE PRECISION NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "diabetesPedigreeFunction" DOUBLE PRECISION NOT NULL,
    "age" INTEGER NOT NULL,
    "predictionResult" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiabetesRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE INDEX "DiabetesRecord_userId_createdAt_idx" ON "DiabetesRecord"("userId", "createdAt");

ALTER TABLE "DiabetesRecord" ADD CONSTRAINT "DiabetesRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
