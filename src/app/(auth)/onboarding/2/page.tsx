"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { updateAboutData } from "./action";

const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function OnboardingStepTwo() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    avatar_url: "",
    cover_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
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
            "bio, location, website, wallet_address, avatar_url, cover_url, username, full_name",
          )
          .eq("id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        const saved = localStorage.getItem(`finess_onboarding_${userId}`);
        const local = saved ? JSON.parse(saved) : {};

        const initialAvatar = local.avatar_url || data?.avatar_url || "";
        const initialCover = local.cover_url || data?.cover_url || "";

        setFormData({
          avatar_url: initialAvatar,
          cover_url: initialCover,
        });

        setAvatarPreview(local.avatar_base64 || initialAvatar || null);
        setCoverPreview(local.cover_base64 || initialCover || null);

        if (local.avatar_base64) {
          try {
            const file = base64ToFile(local.avatar_base64, "avatar_temp");
            setAvatarFile(file);
          } catch (e) {
            console.error("Restore avatar error", e);
          }
        }
        if (local.cover_base64) {
          try {
            const file = base64ToFile(local.cover_base64, "cover_temp");
            setCoverFile(file);
          } catch (e) {
            console.error("Restore cover error", e);
          }
        }
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0] || null;
    if (type === "avatar") setAvatarFile(file);
    else setCoverFile(file);

    if (file && userId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === "avatar") setAvatarPreview(base64String);
        else setCoverPreview(base64String);

        const saved = localStorage.getItem(`finess_onboarding_${userId}`);
        const existing = saved ? JSON.parse(saved) : {};
        localStorage.setItem(
          `finess_onboarding_${userId}`,
          JSON.stringify({ ...existing, [`${type}_base64`]: base64String }),
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded || !userId) return;

    setIsSaving(true);
    setError(null);

    try {
      let finalAvatarUrl = formData.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${userId}-avatar-${Math.random()}.${fileExt}`;
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

      let finalCoverUrl = formData.cover_url;
      // Proses unggah file cover
      if (coverFile) {
        const fileExt = coverFile.name.split(".").pop();
        const fileName = `${userId}-cover-${Math.random()}.${fileExt}`;
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
        avatar_url: finalAvatarUrl || null,
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

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="avatar_url"
            className="block text-sm font-semibold text-slate-300 ml-1"
          >
            Profile Image
          </label>
          <div className="mt-3 mb-4 flex justify-center">
            <div className="relative size-70 overflow-hidden rounded-full border-2 border-primary/20 bg-slate-900 shadow-xl">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                  No Image
                </div>
              )}
            </div>
          </div>
          <input
            id="avatar_url"
            type="file"
            accept="image/*"
            multiple={false}
            onChange={(e) => handleFileChange(e, "avatar")}
            className="mt-2 w-full rounded-2xl border border-custom bg-slate-950/50 px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-slate-300 hover:file:bg-slate-700 transition-all cursor-pointer"
          />
        </div>

        <div>
          <label
            htmlFor="cover_url"
            className="block text-sm font-semibold text-slate-300 ml-1"
          >
            Cover Image
          </label>
          <div className="mt-3 mb-4">
            <div className="h-70 w-full overflow-hidden rounded-2xl border border-custom bg-slate-900 shadow-inner">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="h-full w-full object-cover opacity-80"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                  No Cover
                </div>
              )}
            </div>
          </div>
          <input
            id="cover_url"
            type="file"
            accept="image/*"
            multiple={false}
            onChange={(e) => handleFileChange(e, "cover")}
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
