"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function updateAboutData(data: {
  bio: string | null;
  location: string | null;
  website: string | null;
  wallet_address: string | null;
  cover_url: string | null;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabaseAdmin
    .from("users")
    .update(data)
    .eq("id", userId);

  if (error) throw new Error(error.message);
  return { success: true };
}
