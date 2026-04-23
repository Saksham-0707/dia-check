"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, Eye } from "lucide-react";

import type { PredictionRecord } from "@/lib/api";

type Filter = "all" | "diabetic" | "not-diabetic";

interface HistoryTableProps {
  predictions: PredictionRecord[];
  onSelect?: (id: number) => void;
  selectedId?: number;
}

export default function HistoryTable({
  predictions,
  onSelect,
  selectedId,
}: HistoryTableProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = predictions.filter((prediction) => {
    if (filter === "diabetic") {
      return prediction.prediction === 1;
    }

    if (filter === "not-diabetic") {
      return prediction.prediction === 0;
    }

    return true;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {(["all", "diabetic", "not-diabetic"] as Filter[]).map((filterName) => (
            <button
              key={filterName}
              onClick={() => setFilter(filterName)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                filter === filterName
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {filterName === "all"
                ? "All"
                : filterName === "diabetic"
                  ? "Diabetic"
                  : "Not Diabetic"}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{filtered.length} records shown</p>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-sm">No predictions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">HbA1c</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">BMI</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Probability</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Result</th>
                {onSelect && (
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Details
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((record, idx) => (
                <tr
                  key={record.id}
                  className={`transition-colors ${
                    selectedId === record.id ? "bg-primary/5" : "hover:bg-muted/30"
                  }`}
                >
                  <td className="px-5 py-4 text-xs text-muted-foreground">{idx + 1}</td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {format(new Date(record.createdAt), "MMM d, yyyy")}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {format(new Date(record.createdAt), "h:mm a")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground">{record.Age}</td>
                  <td className="px-5 py-4 text-foreground">{record.HbA1c}</td>
                  <td className="px-5 py-4 text-foreground">{record.BMI}</td>
                  <td className="px-5 py-4 text-foreground">
                    {(record.probability * 100).toFixed(1)}%
                  </td>
                  <td className="px-5 py-4">
                    {record.prediction === 1 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        Diabetic
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        Not Diabetic
                      </span>
                    )}
                  </td>
                  {onSelect && (
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onSelect(record.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
