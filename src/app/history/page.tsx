"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";

import AuthGuard from "@/components/AuthGuard";
import HistoryTable from "@/components/HistoryTable";
import Navbar from "@/components/Navbar";
import { getPredictionById, getPredictionHistory, type DiabetesRecord } from "@/lib/api";

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<DiabetesRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DiabetesRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPredictionHistory();
        setPredictions(data);

        if (data[0]) {
          const firstRecord = await getPredictionById(data[0].id);
          setSelectedRecord(firstRecord);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load prediction history.");
      } finally {
        setLoading(false);
      }
    };

    void loadHistory();
  }, []);

  const handleSelect = async (id: number) => {
    try {
      const record = await getPredictionById(id);
      setSelectedRecord(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the selected record.");
    }
  };

  return (
    <AuthGuard>
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

          {loading ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground shadow-sm">
              Loading history...
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
                      {selectedRecord.predictionResult}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Saved on {format(new Date(selectedRecord.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                      <Detail label="Pregnancies" value={selectedRecord.pregnancies} />
                      <Detail label="Glucose" value={selectedRecord.glucose} />
                      <Detail label="Blood Pressure" value={selectedRecord.bloodPressure} />
                      <Detail label="Skin Thickness" value={selectedRecord.skinThickness} />
                      <Detail label="Insulin" value={selectedRecord.insulin} />
                      <Detail label="BMI" value={selectedRecord.bmi} />
                      <Detail
                        label="Pedigree Function"
                        value={selectedRecord.diabetesPedigreeFunction}
                      />
                      <Detail label="Age" value={selectedRecord.age} />
                    </div>
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
    </AuthGuard>
  );
}

function Detail({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
