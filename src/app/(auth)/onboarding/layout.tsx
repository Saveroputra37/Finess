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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8 rounded-[28px] border border-custom bg-card p-6 shadow-2xl">
          <div className="mb-4">
            <h1 className="text-3xl font-semibold text-white">Onboarding</h1>
            <p className="text-muted mt-2">
              Complete your profile in a few simple steps.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((step) => {
              const isActive = step.number === activeStep;
              return (
                <div
                  key={step.number}
                  className={`rounded-2xl border px-4 py-4 transition ${
                    isActive
                      ? "border-primary bg-blue-950/30"
                      : "border-custom bg-slate-950/50"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">Step {step.number}</p>
                  <p className="text-sm text-muted mt-1">{step.label}</p>
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
