"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

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

        if (!data || !data.username || !data.full_name) {
          router.replace("/onboarding/1");
          return;
        }

        setFormData({
          bio: data?.bio ?? "",
          location: data.location ?? "",
          website: data.website ?? "",
          wallet_address: data.wallet_address ?? "",
          cover_url: data.cover_url ?? "",
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
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded || !userId) return;

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError, status } = await supabase
        .from("users")
        .update({
          bio: formData.bio || null,
          location: formData.location || null,
          website: formData.website || null,
          wallet_address: formData.wallet_address || null,
          cover_url: formData.cover_url || null,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Step 2 Update Error:", updateError);
        throw new Error(
          updateError.message || `Update failed with status ${status}`,
        );
      }

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
        <label htmlFor="bio" className="block text-sm font-medium text-white">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={160}
          placeholder="Tell people about yourself"
          className="mt-2 w-full min-h-[120px] rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-white"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Jakarta, Indonesia"
            className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-white"
          >
            Website
          </label>
          <input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="wallet_address"
            className="block text-sm font-medium text-white"
          >
            Wallet Address
          </label>
          <input
            id="wallet_address"
            name="wallet_address"
            value={formData.wallet_address}
            onChange={handleChange}
            placeholder="0x123..."
            className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div>
          <label
            htmlFor="cover_url"
            className="block text-sm font-medium text-white"
          >
            Cover Image URL
          </label>
          <input
            id="cover_url"
            name="cover_url"
            value={formData.cover_url}
            onChange={handleChange}
            placeholder="https://..."
            className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-2xl bg-primary px-5 py-3 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {isSaving ? "Saving about info..." : "Continue to Finish"}
      </button>
    </form>
  );
}
