import { Suspense } from "react";

import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe,transparent_35%),linear-gradient(135deg,#eff6ff,#f8fafc)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,#1e3a5f,transparent_30%),linear-gradient(135deg,#0c1424,#111827)]">
      <Suspense fallback={null}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  );
}
