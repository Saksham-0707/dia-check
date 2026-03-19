"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { createPrediction, type DiabetesRecord, type PredictionInput } from "@/lib/api";
import ResultCard from "@/components/ResultCard";

interface PredictionFormProps {
  onPredicted?: (record: DiabetesRecord) => void;
}

interface FieldWrapperProps {
  label: string;
  helper: string;
  error?: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, helper, error, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function PredictionForm({ onPredicted }: PredictionFormProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiabetesRecord | null>(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PredictionInput>();

  const onSubmit = async (data: PredictionInput) => {
    setLoading(true);
    setServerError("");

    try {
      const record = await createPrediction({
        pregnancies: Number(data.pregnancies),
        glucose: Number(data.glucose),
        bloodPressure: Number(data.bloodPressure),
        skinThickness: Number(data.skinThickness),
        insulin: Number(data.insulin),
        bmi: Number(data.bmi),
        diabetesPedigreeFunction: Number(data.diabetesPedigreeFunction),
        age: Number(data.age),
      });

      setResult(record);
      onPredicted?.(record);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setServerError("");
    reset();
  };

  if (result) {
    return <ResultCard record={result} onReset={handleReset} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FieldWrapper
          label="Pregnancies"
          helper="Number of times pregnant"
          error={errors.pregnancies?.message}
        >
          <input
            type="number"
            placeholder="e.g. 2"
            className={inputClass}
            {...register("pregnancies", {
              required: "Pregnancies is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Glucose"
          helper="Plasma glucose concentration"
          error={errors.glucose?.message}
        >
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 148"
            className={inputClass}
            {...register("glucose", {
              required: "Glucose is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Blood Pressure"
          helper="Diastolic blood pressure (mm Hg)"
          error={errors.bloodPressure?.message}
        >
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 72"
            className={inputClass}
            {...register("bloodPressure", {
              required: "Blood pressure is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Skin Thickness"
          helper="Triceps skin fold thickness (mm)"
          error={errors.skinThickness?.message}
        >
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 35"
            className={inputClass}
            {...register("skinThickness", {
              required: "Skin thickness is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Insulin"
          helper="2-hour serum insulin"
          error={errors.insulin?.message}
        >
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 120"
            className={inputClass}
            {...register("insulin", {
              required: "Insulin is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FieldWrapper>

        <FieldWrapper label="BMI" helper="Body mass index" error={errors.bmi?.message}>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 33.6"
            className={inputClass}
            {...register("bmi", {
              required: "BMI is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Diabetes Pedigree Function"
          helper="Family-history influence score"
          error={errors.diabetesPedigreeFunction?.message}
        >
          <input
            type="number"
            step="0.001"
            placeholder="e.g. 0.627"
            className={inputClass}
            {...register("diabetesPedigreeFunction", {
              required: "Pedigree function is required",
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </FieldWrapper>

        <FieldWrapper label="Age" helper="Age in years" error={errors.age?.message}>
          <input
            type="number"
            placeholder="e.g. 50"
            className={inputClass}
            {...register("age", {
              required: "Age is required",
              min: { value: 1, message: "Must be at least 1" },
              max: { value: 120, message: "Must be at most 120" },
            })}
          />
        </FieldWrapper>
      </div>

      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {serverError}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Predicting...
            </>
          ) : (
            "Check Diabetes Status"
          )}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Each prediction is stored securely in your account history.
        </p>
      </div>
    </form>
  );
}
