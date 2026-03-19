import Link from "next/link";
import { AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";

import type { DiabetesRecord } from "@/lib/api";

interface ResultCardProps {
  record: DiabetesRecord;
  onReset?: () => void;
}

export default function ResultCard({ record, onReset }: ResultCardProps) {
  const isDiabetic = record.predictionResult === "Diabetic";

  return (
    <div className="animate-scale-in">
      <div
        className={`rounded-2xl border-2 p-8 shadow-lg ${
          isDiabetic
            ? "border-red-200 bg-red-50 dark:border-red-800/60 dark:bg-red-950/30"
            : "border-emerald-200 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/30"
        }`}
      >
        <div className="mb-6 flex justify-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${
              isDiabetic ? "bg-red-100 dark:bg-red-900/40" : "bg-emerald-100 dark:bg-emerald-900/40"
            }`}
          >
            {isDiabetic ? (
              <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" strokeWidth={1.75} />
            ) : (
              <CheckCircle className="h-10 w-10 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} />
            )}
          </div>
        </div>

        <div className="mb-4 text-center">
          <span
            className={`mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
              isDiabetic
                ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
            }`}
          >
            Prediction Result
          </span>
          <h2
            className={`text-3xl font-bold ${
              isDiabetic ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"
            }`}
          >
            {record.predictionResult}
          </h2>
        </div>

        <p
          className={`mb-6 text-center text-base leading-relaxed ${
            isDiabetic ? "text-red-600 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300"
          }`}
        >
          {isDiabetic
            ? "The rule-based model flagged elevated risk based on glucose or BMI."
            : "The submitted values did not cross the current rule-based diabetes threshold."}
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-white/80 bg-white/60 p-4 dark:border-white/10 dark:bg-black/20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Glucose
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">{record.glucose}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              BMI
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">{record.bmi}</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-white/80 bg-white/60 p-4 dark:border-white/10 dark:bg-black/20">
          <p className="text-center text-xs text-muted-foreground">
            <span className="font-semibold">Medical Disclaimer:</span> This tool does not replace
            professional medical diagnosis or treatment.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent"
            >
              <RotateCcw className="h-4 w-4" />
              New Assessment
            </button>
          )}
          <Link
            href="/history"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
