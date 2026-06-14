"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function OnboardingStepOne() {
  const { isLoaded, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    avatar_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.replace("/sign-in");
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const loadProfile = async () => {
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

        if (!data && fetchError?.code !== "PGRST116") return;

        const saved = localStorage.getItem(`finess_onboarding_${userId}`);
        const local = saved ? JSON.parse(saved) : {};

        const initial = {
          username: local.username || data?.username || "",
          full_name: local.full_name || data?.full_name || user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          avatar_url:
            local.avatar_url || data?.avatar_url || user?.imageUrl || "",
        };

        setFormData(initial);
      } catch (err) {
        console.error("Step 1 Load Error:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load onboarding profile";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isLoaded, userId, user, router]);

  useEffect(() => {
    if (!userLoaded || !user) return;

    setFormData((current) => ({
      ...current,
      full_name: current.full_name || user.fullName || "",
      email: current.email || user.primaryEmailAddress?.emailAddress || "",
      avatar_url: current.avatar_url || user.imageUrl || "",
    }));
  }, [userLoaded, user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => {
      const updated = { ...current, [name]: value };
      if (userId) {
        const saved = localStorage.getItem(`finess_onboarding_${userId}`);
        const existing = saved ? JSON.parse(saved) : {};
        localStorage.setItem(
          `finess_onboarding_${userId}`,
          JSON.stringify({ ...existing, ...updated }),
        );
      }
      return updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded || !userId) return;

    setIsSaving(true);
    setError(null);

    try {
      let finalAvatarUrl = formData.avatar_url;

      // Proses unggah file jika ada file baru yang dipilih
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("userLog")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("userLog")
          .getPublicUrl(filePath);

        finalAvatarUrl = urlData.publicUrl;
      }

      const { error: upsertError, status } = await supabase
        .from("users")
        .upsert(
          {
            id: userId,
            username: formData.username,
            full_name: formData.full_name,
            email: formData.email,
            avatar_url: finalAvatarUrl,
          },
          { onConflict: "id" },
        );

      if (upsertError) {
        console.error("Supabase Upsert Error details:", upsertError);
        throw new Error(
          upsertError.message || `Save failed with status ${status}`,
        );
      }

      router.replace("/onboarding/2");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-white">
        Loading profile step...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-slate-300 ml-1"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="your username"
          className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          required
        />
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-semibold text-slate-300 ml-1"
        >
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="John Doe"
          className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-300 ml-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          value={formData.email}
          disabled
          className="mt-2 w-full rounded-2xl border border-custom bg-slate-900/40 px-4 py-3 text-slate-500 cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="avatar_url"
          className="block text-sm font-semibold text-slate-300 ml-1"
        >
          Profile Image
        </label>
        <input
          id="avatar_url"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-slate-300 hover:file:bg-slate-700 transition-all cursor-pointer"
        />
        {formData.avatar_url && !avatarFile && (
          <p className="mt-2 text-xs text-slate-500 ml-1">
            Current: Using profile image from account
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-2xl bg-primary px-5 py-3 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {isSaving ? "Saving profile..." : "Continue to About"}
      </button>
    </form>
  );
}
