"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { finishOnboarding } from "./action";

export default function OnboardingStepThree() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [userData, setUserData] = useState<any>(null);

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
          .select("*")
          .eq("id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        setUserData(data);
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
      await finishOnboarding();

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

      {userData && (
        <div className="grid gap-6">
          <div className="rounded-3xl border border-custom bg-slate-950/50 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white ml-1">
              Profile Details
            </h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/30 border border-custom">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20 bg-slate-950 shadow-lg">
                {userData.avatar_url ? (
                  <img
                    src={userData.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-600">
                    No Avatar
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-white">
                  {userData.full_name}
                </p>
                <p className="text-slate-500 text-sm">@{userData.username}</p>
                <p className="text-slate-500 text-xs mt-1">{userData.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-custom bg-slate-950/50 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white ml-1">
              Additional Info
            </h3>
            {userData.cover_url && (
              <div className="h-24 w-full overflow-hidden rounded-2xl border border-custom bg-slate-950 shadow-inner">
                <img
                  src={userData.cover_url}
                  alt="Cover"
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 p-4 rounded-2xl bg-slate-900/30 border border-custom">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Bio
                </p>
                <p className="text-sm text-slate-300 italic">
                  "{userData.bio || "No bio added..."}"
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Location
                </p>
                <p className="text-sm text-slate-300">
                  {userData.location || "Not specified"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Website
                </p>
                <p className="text-sm text-primary truncate">
                  {userData.website || "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Wallet
                </p>
                <p className="text-xs font-mono text-slate-400 break-all">
                  {userData.wallet_address || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
