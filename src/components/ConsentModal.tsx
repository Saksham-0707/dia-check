"use client";

interface ConsentModalProps {
  open: boolean;
  loading?: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentModal({
  open,
  loading = false,
  onAccept,
  onDecline,
}: ConsentModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          Prediction History
        </p>
        <h2 className="mt-3 text-2xl font-bold text-foreground">Save your data?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Do you want us to store your prediction history for future reference?
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onAccept}
            disabled={loading}
            className="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : "Yes, Save My Data"}
          </button>
          <button
            onClick={onDecline}
            disabled={loading}
            className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
          >
            No, Don&apos;t Save
          </button>
        </div>
      </div>
    </div>
  );
}
