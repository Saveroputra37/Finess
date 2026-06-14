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
          .select("username, first_name, last_name")
          .eq("id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        if (!data?.username || !data?.first_name || !data?.last_name) {
          router.replace("/onboarding/1");
          return;
        }

        setProfileComplete(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify profile status");
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
      const { error: upsertError } = await supabase.from("users").upsert({
        id: userId,
        is_verified: true,
      });

      if (upsertError) throw upsertError;
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete onboarding");
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

        <div className="rounded-3xl border border-custom bg-slate-950/80 p-6">
          <h2 className="text-2xl font-semibold text-white">You're almost ready</h2>
          <p className="mt-3 text-muted">
            Review your onboarding and finish to experience the app.
          </p>
          <ul className="mt-5 space-y-3 text-white">
            <li className="rounded-2xl bg-background/80 p-4">
              <p className="font-semibold">Step 1</p>
              <p className="text-sm text-muted">Profile details saved.</p>
            </li>
            <li className="rounded-2xl bg-background/80 p-4">
              <p className="font-semibold">Step 2</p>
              <p className="text-sm text-muted">About details saved.</p>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          disabled={!profileComplete || isSaving}
          className="w-full rounded-2xl bg-primary px-5 py-3 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Completing onboarding..." : "Finish onboarding"}
        </button>
      </div>
  );
}
