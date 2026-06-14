"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function OnboardingStepThree() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.replace("/sign-in");
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const loadStatus = async () => {
      setIsLoading(true);

      try {
        const { data, error: fetchError } = await supabase
          .from("users")
          .select("username, full_name")
          .eq("id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        setProfileComplete(true);
      } catch (err) {
        console.error("Error fetching status:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify profile status",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStatus();
  }, [isLoaded, userId, router]);

  const handleFinish = async () => {
    if (!userId) return;
    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError, status } = await supabase
        .from("users")
        .update({
          is_verified: true,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Supabase Finalize Error:", updateError);
        throw new Error(
          updateError.message || `Finalization failed with status ${status}`,
        );
      }

      localStorage.removeItem(`finess_onboarding_${userId}`);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete onboarding",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-white">
        Finalizing onboarding...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-custom bg-slate-950/50 p-6 shadow-inner">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          You're almost ready
        </h2>
        <p className="mt-3 text-slate-400">
          Review your onboarding and finish to experience the app.
        </p>
        <ul className="mt-5 space-y-3 text-white">
          <li className="rounded-2xl bg-slate-900/50 border border-emerald-500/20 p-4 flex items-center justify-between transition-all hover:bg-slate-900/80">
            <div>
              <p className="font-bold text-white">Step 1</p>
              <p className="text-sm text-slate-500">Profile details saved.</p>
            </div>
            <div className="bg-emerald-500/20 p-1 rounded-full">
              <svg
                className="w-5 h-5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </li>
          <li className="rounded-2xl bg-slate-900/50 border border-emerald-500/20 p-4 flex items-center justify-between transition-all hover:bg-slate-900/80">
            <div>
              <p className="font-bold text-white">Step 2</p>
              <p className="text-sm text-slate-500">About details saved.</p>
            </div>
            <div className="bg-emerald-500/20 p-1 rounded-full">
              <svg
                className="w-5 h-5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          type="button"
          onClick={() => router.push("/onboarding/2")}
          className="w-full md:w-1/3 rounded-2xl border border-custom bg-slate-900/50 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleFinish}
          disabled={!profileComplete || isSaving}
          className="w-full md:flex-1 rounded-2xl bg-primary px-5 py-3 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Completing onboarding..." : "Finish onboarding"}
        </button>
      </div>
    </div>
  );
}
