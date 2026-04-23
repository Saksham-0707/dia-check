import Link from "next/link";
import { AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";

import type { PredictionResponse } from "@/lib/api";

interface ResultCardProps {
  record: PredictionResponse;
  onReset?: () => void;
}

export default function ResultCard({ record, onReset }: ResultCardProps) {
  const predictionResult = record.prediction === 1 ? "Diabetic" : "Not Diabetic";
  const isDiabetic = predictionResult === "Diabetic";

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
            {predictionResult}
          </h2>
        </div>

        <p
          className={`mb-6 text-center text-base leading-relaxed ${
            isDiabetic ? "text-red-600 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300"
          }`}
        >
          {isDiabetic
            ? "The trained model flagged elevated diabetes risk for these values."
            : "The trained model did not flag elevated diabetes risk for these values."}
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-white/80 bg-white/60 p-4 dark:border-white/10 dark:bg-black/20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Probability
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {(record.probability * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Threshold
            </p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {(record.threshold * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-white/80 bg-white/60 p-4 dark:border-white/10 dark:bg-black/20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Explanation Features
          </p>
          <div className="space-y-2">
            {record.explanation.map((item) => (
              <div
                key={item.feature}
                className="flex items-center justify-between gap-3 rounded-lg bg-background/70 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">{item.feature}</span>
                <span className={item.impact >= 0 ? "text-red-600" : "text-emerald-600"}>
                  {item.impact.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-white/80 bg-white/60 p-4 dark:border-white/10 dark:bg-black/20">
          <p className="text-center text-xs text-muted-foreground">
            <span className="font-semibold">Medical Disclaimer:</span> This tool does not replace
            professional medical diagnosis or treatment.
          </p>
        </div>

        {record.saved === false && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="text-center text-xs text-amber-700 dark:text-amber-300">
              This result was not stored. Turn on Save this result to keep future predictions in history.
            </p>
          </div>
        )}

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
          {record.saved && (
            <Link
              href="/history"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90"
            >
              View History
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
