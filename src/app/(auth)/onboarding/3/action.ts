"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function finishOnboarding() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabaseAdmin
    .from("users")
    .update({ is_verified: true })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  return { success: true };
}
