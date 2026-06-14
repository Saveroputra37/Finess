"use client";

import { usePathname } from "next/navigation";
import React from "react";

const steps = [
  { number: 1, label: "Profile" },
  { number: 2, label: "About" },
  { number: 3, label: "Finish" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeStep = Number(pathname?.split("/").pop() ?? "1");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-10">
      <div className="w-[80%]">
        <div className="mb-8 rounded-[28px] border border-custom bg-card p-6 shadow-2xl">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Onboarding
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Complete your profile in a few simple steps.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((step) => {
              const isActive = step.number === activeStep;
              const isCompleted = step.number < activeStep;
              return (
                <div
                  key={step.number}
                  className={`rounded-2xl border p-4 transition-all duration-300 flex items-center gap-3 ${
                    isActive
                      ? "border-primary bg-primary/10 ring-1 ring-primary/50"
                      : isCompleted
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-custom bg-slate-900/50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive ? "bg-primary text-white" : isCompleted ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"}`}
                  >
                    {step.number}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${isActive ? "text-white" : "text-slate-400"}`}
                    >
                      Step {step.number}
                    </p>
                    <p className="text-xs text-slate-500">{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-custom bg-card p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
