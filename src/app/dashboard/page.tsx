"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, CheckCircle, ClipboardList } from "lucide-react";

import AuthGuard from "@/components/AuthGuard";
import ConsentModal from "@/components/ConsentModal";
import HistoryTable from "@/components/HistoryTable";
import Navbar from "@/components/Navbar";
import PredictionForm from "@/components/PredictionForm";
import StatCard from "@/components/StatCard";
import { getPredictionHistory, updateConsent, type DiabetesRecord } from "@/lib/api";
import { getAuthUser, updateStoredUser } from "@/lib/auth";

export default function DashboardPage() {
  const [predictions, setPredictions] = useState<DiabetesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);

  useEffect(() => {
    setShowConsentModal(getAuthUser()?.consent !== true);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPredictionHistory();
        setPredictions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load your history.");
      } finally {
        setLoading(false);
      }
    };

    void loadHistory();
  }, []);

  const total = predictions.length;
  const diabeticCount = predictions.filter(
    (prediction) => prediction.predictionResult === "Diabetic",
  ).length;
  const recent = predictions.slice(0, 5);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-8 text-white shadow-lg">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-14 left-24 h-36 w-36 rounded-full bg-black/10" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">
                  DiaCheck AI
                </span>
              </div>
              <h1 className="max-w-2xl text-3xl font-bold">
                Diabetes prediction dashboard with account-based history tracking
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-blue-100">
                Submit patient metrics, get an instant rule-based diabetes prediction, and keep
                each record attached to your account in PostgreSQL.
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <StatCard
              title="Total Predictions"
              value={total}
              icon={ClipboardList}
              description="Saved to your account history"
            />
            <StatCard
              title="Diabetic Results"
              value={diabeticCount}
              icon={AlertTriangle}
              description={total ? `${Math.round((diabeticCount / total) * 100)}% of records` : "No predictions yet"}
              variant="danger"
              delay={100}
            />
            <StatCard
              title="Not Diabetic"
              value={total - diabeticCount}
              icon={CheckCircle}
              description="Results below the current risk rule"
              variant="success"
              delay={200}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_1fr]">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  New Prediction
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  Enter diabetes assessment values
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The current prediction rule marks a record as diabetic when glucose is above 140
                  or BMI is above 30.
                </p>
              </div>
              <PredictionForm
                onPredicted={(record) => setPredictions((current) => [record, ...current])}
              />
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                    Recent History
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-foreground">Latest predictions</h2>
                </div>
                <Link
                  href="/history"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  Loading your prediction history...
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </div>
              ) : recent.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  No records yet. Submit your first assessment to populate history.
                </div>
              ) : (
                <HistoryTable predictions={recent} />
              )}
            </section>
          </div>
        </main>
        <ConsentModal
          open={showConsentModal}
          loading={consentLoading}
          onDecline={() => setShowConsentModal(false)}
          onAccept={async () => {
            try {
              setConsentLoading(true);
              const response = await updateConsent();
              updateStoredUser(response.user);
              setShowConsentModal(false);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to update consent.");
            } finally {
              setConsentLoading(false);
            }
          }}
        />
      </div>
    </AuthGuard>
  );
}
