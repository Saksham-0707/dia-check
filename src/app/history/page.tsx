"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";

import HistoryTable from "@/components/HistoryTable";
import Navbar from "@/components/Navbar";
import { getPredictionHistory, type PredictionRecord } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

export default function HistoryPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const syncAuth = () => setAuthenticated(isAuthenticated());
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("diacheck-auth-changed", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("diacheck-auth-changed", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (authenticated !== true) {
      setLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPredictionHistory();
        setPredictions(data);

        if (data[0]) {
          setSelectedRecord(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load prediction history.");
      } finally {
        setLoading(false);
      }
    };

    void loadHistory();
  }, [authenticated]);

  const handleSelect = (id: number) => {
    const record = predictions.find((prediction) => prediction.id === id);
    if (record) {
      setSelectedRecord(record);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                History
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Prediction history</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review every saved record linked to your account and inspect the full values behind
              each result.
            </p>
          </div>

          {loading || authenticated === null ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground shadow-sm">
              Loading history...
            </div>
          ) : authenticated === false ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground shadow-sm">
              Please login to view your history
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          ) : predictions.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground shadow-sm">
              No predictions found yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <HistoryTable
                  predictions={predictions}
                  onSelect={handleSelect}
                  selectedId={selectedRecord?.id}
                />
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  Record Detail
                </p>
                {selectedRecord ? (
                  <>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">
                      {selectedRecord.prediction === 1 ? "Diabetic" : "Not Diabetic"}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Saved on {format(new Date(selectedRecord.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      <Detail label="Age" value={selectedRecord.Age} />
                      <Detail label="HbA1c" value={selectedRecord.HbA1c} />
                      <Detail label="BMI" value={selectedRecord.BMI} />
                      <Detail
                        label="Probability"
                        value={`${(selectedRecord.probability * 100).toFixed(1)}%`}
                      />
                      <Detail label="Threshold" value={`${(selectedRecord.threshold * 100).toFixed(1)}%`} />
                      <Detail label="Quality Of Life" value={selectedRecord.QualityOfLifeScore} />
                      <Detail label="Gender" value={selectedRecord.Gender} />
                      <Detail label="Physical Activity" value={selectedRecord.PhysicalActivity} />
                      <Detail label="Diet Quality" value={selectedRecord.DietQuality} />
                      <Detail label="Sleep Quality" value={selectedRecord.SleepQuality} />
                    </div>
                    {selectedRecord.explanation && selectedRecord.explanation.length > 0 && (
                      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          SHAP Explanation
                        </p>
                        <div className="mt-3 space-y-2">
                          {selectedRecord.explanation.map((item) => (
                            <div
                              key={item.feature}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="font-medium text-foreground">{item.feature}</span>
                              <span className={item.impact >= 0 ? "text-red-600" : "text-emerald-600"}>
                                {item.impact.toFixed(4)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Select a record to inspect its full values.
                  </p>
                )}
              </div>
            </div>
          )}
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
