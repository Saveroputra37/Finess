import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check .env.local"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Browser client helper
export const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};
