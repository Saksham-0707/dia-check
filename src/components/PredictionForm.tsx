"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { createPrediction, type PredictionInput, type PredictionResponse } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import { predictionFields } from "@/lib/prediction-fields";
import ResultCard from "@/components/ResultCard";

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

export default function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [serverError, setServerError] = useState("");
  const canSave = getAuthUser()?.consent === true;
  const [saveResult, setSaveResult] = useState(canSave);

  useEffect(() => {
    setSaveResult(canSave);
  }, [canSave]);

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
      const payload = predictionFields.reduce<PredictionInput>((current, field) => {
        current[field.name] =
          field.type === "number" ? Number(data[field.name]) : String(data[field.name]);
        return current;
      }, {});
      payload.saveResult = canSave && saveResult;
      const record = await createPrediction(payload);

      setResult(record);
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
        {predictionFields.map((field) => (
          <FieldWrapper
            key={field.name}
            label={field.label}
            helper={field.helper}
            error={errors[field.name]?.message}
          >
            {field.type === "select" ? (
              <select
                className={inputClass}
                defaultValue=""
                {...register(field.name, {
                  required: `${field.label} is required`,
                })}
              >
                <option value="" disabled>
                  Select {field.label}
                </option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                step={field.step ?? "any"}
                min={field.min}
                max={field.max}
                placeholder={`Enter ${field.label}`}
                className={inputClass}
                {...register(field.name, {
                  required: `${field.label} is required`,
                  valueAsNumber: true,
                  min:
                    field.min === undefined
                      ? undefined
                      : { value: field.min, message: `Must be at least ${field.min}` },
                  max:
                    field.max === undefined
                      ? undefined
                      : { value: field.max, message: `Must be at most ${field.max}` },
                })}
              />
            )}
          </FieldWrapper>
        ))}
      </div>

      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {serverError}
        </div>
      )}

      <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm">
        <input
          type="checkbox"
          checked={canSave && saveResult}
          disabled={!canSave}
          onChange={(event) => setSaveResult(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-border"
        />
        <span>
          <span className="block font-semibold text-foreground">Save this result</span>
          <span className="block text-xs text-muted-foreground">
            {canSave
              ? "Saved results appear in your history."
              : "Enable prediction history consent to save results."}
          </span>
        </span>
      </label>

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
          Your values are sent to the Python model API for prediction.
        </p>
      </div>
    </form>
  );
}
