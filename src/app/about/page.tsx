import Navbar from "@/components/Navbar";
import { Info, Brain, ShieldAlert, Microscope, HeartPulse, Stethoscope } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Info className="h-5 w-5 text-primary" strokeWidth={1.75} />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">About</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">About DiaCheck AI</h1>
          <p className="text-muted-foreground leading-relaxed">
            Learn how our machine learning system works and what it means for your health.
          </p>
        </div>

        <div className="space-y-6">
          {/* What is ML */}
          <div
            className="bg-card border border-border rounded-2xl p-7 shadow-sm animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold text-foreground">What is Machine Learning?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Machine Learning (ML) is a type of artificial intelligence that learns from data.
              Instead of being programmed with explicit rules, an ML model analyzes thousands of
              examples to discover patterns — and then uses those patterns to make predictions on new data.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of it like teaching a child: instead of telling them exactly what a cat looks like,
              you show them hundreds of pictures. Over time, they learn to recognize a cat on their own.
              ML works the same way — but with numbers and data.
            </p>
          </div>

          {/* Non-invasive features */}
          <div
            className="bg-card border border-border rounded-2xl p-7 shadow-sm animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <Microscope className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold text-foreground">Non-Invasive Features</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Traditional diabetes screening often requires a blood test. DiaCheck AI uses
              <strong className="text-foreground"> non-invasive features</strong> — information you
              can provide without any medical procedures:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                "Age",
                "BMI (Body Mass Index)",
                "Gender",
                "Family history of diabetes",
                "Physical activity level",
                "Smoking status",
                "Blood pressure",
                "Waist circumference",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3.5 py-2.5 rounded-xl"
                >
                  <HeartPulse className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* How it works */}
          <div
            className="bg-card border border-border rounded-2xl p-7 shadow-sm animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold text-foreground">How DiaCheck AI Works</h2>
            </div>
            <ol className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Enter Your Information",
                  desc: "Fill in the health assessment form with your basic health metrics.",
                },
                {
                  step: "2",
                  title: "ML Model Analyzes",
                  desc: "Our machine learning model processes your data against trained patterns.",
                },
                {
                  step: "3",
                  title: "Binary Classification",
                  desc: "The model outputs a clear result: Diabetic or Non-Diabetic.",
                },
                {
                  step: "4",
                  title: "Take Action",
                  desc: "If at risk, consult a medical professional for confirmed diagnosis.",
                },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4">
                  <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Medical Disclaimer */}
          <div
            className="rounded-2xl border-2 border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 p-7 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold text-amber-800 dark:text-amber-300">Medical Disclaimer</h2>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              <strong>This tool is not a medical diagnosis and should not replace professional medical advice.</strong>{" "}
              DiaCheck AI is designed as an educational and screening aid only. Always consult a qualified
              healthcare professional for proper diagnosis and treatment. The predictions generated by this
              system are based on statistical patterns and may not accurately reflect individual medical conditions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
