"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { login, signup } from "@/lib/api";
import { isAuthenticated, saveAuthSession } from "@/lib/auth";

interface AuthFormProps {
  mode: "login" | "signup";
}

interface AuthFields {
  name: string;
  email: string;
  password: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";
  const nextPath = searchParams.get("next") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFields>();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (values: AuthFields) => {
    setLoading(true);
    setServerError("");

    try {
      const session = isSignup
        ? await signup(values)
        : await login({ email: values.email, password: values.password });

      saveAuthSession(session);
      router.replace(nextPath);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">DiaCheck AI</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignup
            ? "Sign up to save diabetes predictions and review your past records."
            : "Log in to access your dashboard and prediction history."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {isSignup && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Name</label>
            <input
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your full name"
              {...register("name", {
                required: "Name is required.",
                minLength: { value: 2, message: "Name must be at least 2 characters." },
              })}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Email</label>
          <input
            type="email"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required." })}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <input
            type="password"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 6, message: "Password must be at least 6 characters." },
            })}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-primary hover:underline"
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
