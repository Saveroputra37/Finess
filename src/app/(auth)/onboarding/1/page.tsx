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
    first_name: "",
    last_name: "",
    email: "",
    avatar_url: "",
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
          .select("*")
          .eq("id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        const initial = {
          username: data?.username ?? "",
          first_name: data?.first_name ?? user?.firstName ?? "",
          last_name: data?.last_name ?? user?.lastName ?? "",
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          avatar_url: data?.avatar_url ?? user?.imageUrl ?? "",
        };

        setFormData(initial);

        if (data?.username && data?.first_name && data?.last_name) {
          router.replace("/onboarding/2");
          return;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load onboarding profile"
        );
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
      first_name: current.first_name || user.firstName || "",
      last_name: current.last_name || user.lastName || "",
      email: current.email || user.primaryEmailAddress?.emailAddress || "",
      avatar_url: current.avatar_url || user.imageUrl || "",
    }));
  }, [userLoaded, user]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
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
      const { error: upsertError } = await supabase.from("users").upsert({
        id: userId,
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        avatar_url: formData.avatar_url,
      });

      if (upsertError) throw upsertError;
      router.push("/onboarding/2");
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
        <label htmlFor="username" className="block text-sm font-medium text-white">
          Username
        </label>
        <input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="your username"
          className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-white">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="John"
            className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            required
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-white">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Doe"
            className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          name="email"
          value={formData.email}
          disabled
          className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/70 px-4 py-3 text-white"
        />
      </div>

      <div>
        <label htmlFor="avatar_url" className="block text-sm font-medium text-white">
          Profile Image URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          value={formData.avatar_url}
          onChange={handleChange}
          placeholder="https://..."
          className="mt-2 w-full rounded-2xl border border-custom bg-background px-4 py-3 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
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
