"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { updateAboutData } from "./action";

export default function OnboardingStepTwo() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    website: "",
    wallet_address: "",
    cover_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
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
          .select(
            "bio, location, website, wallet_address, cover_url, username, full_name",
          )
          .eq("id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        const saved = localStorage.getItem(`finess_onboarding_${userId}`);
        const local = saved ? JSON.parse(saved) : {};

        setFormData({
          bio: local.bio || data?.bio || "",
          location: local.location || data?.location || "",
          website: local.website || data?.website || "",
          wallet_address: local.wallet_address || data?.wallet_address || "",
          cover_url: local.cover_url || data?.cover_url || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(
          err instanceof Error ? err.message : "Unable to load your about info",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isLoaded, userId, router]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
      let finalCoverUrl = formData.cover_url;

      // Proses unggah file cover
      if (coverFile) {
        const fileExt = coverFile.name.split(".").pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("userLog")
          .upload(filePath, coverFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("userLog")
          .getPublicUrl(filePath);

        finalCoverUrl = urlData.publicUrl;
      }

      await updateAboutData({
        bio: formData.bio || null,
        location: formData.location || null,
        website: formData.website || null,
        wallet_address: formData.wallet_address || null,
        cover_url: finalCoverUrl || null,
      });

      router.replace("/onboarding/3");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save about info",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-white">
        Preparing next step...
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
          htmlFor="bio"
          className="block text-sm font-semibold text-slate-300 ml-1"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={160}
          placeholder="Tell people about yourself"
          className="mt-2 w-full min-h-[120px] rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-slate-300 ml-1"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Jakarta, Indonesia"
            className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="block text-sm font-semibold text-slate-300 ml-1"
          >
            Website
          </label>
          <input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="wallet_address"
            className="block text-sm font-semibold text-slate-300 ml-1"
          >
            Wallet Address
          </label>
          <input
            id="wallet_address"
            name="wallet_address"
            value={formData.wallet_address}
            onChange={handleChange}
            placeholder="0x123..."
            className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="cover_url"
            className="block text-sm font-semibold text-slate-300 ml-1"
          >
            Cover Image
          </label>
          <input
            id="cover_url"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-slate-300 hover:file:bg-slate-700 transition-all cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          type="button"
          onClick={() => router.push("/onboarding/1")}
          className="w-full md:w-1/3 rounded-2xl border border-custom bg-slate-900/50 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full md:flex-1 rounded-2xl bg-primary px-5 py-3 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Saving about info..." : "Continue to Finish"}
        </button>
      </div>
    </form>
  );
}
