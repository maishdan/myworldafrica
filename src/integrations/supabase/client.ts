import { createClient } from "@supabase/supabase-js";

// Fetch keys securely from the .env file instead of hardcoding them
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn("⚠️ Supabase environment variables are missing. Please check your .env file.");
}

export const supabase = createClient(SUPABASE_URL || "", SUPABASE_PUBLISHABLE_KEY || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export const SUPABASE_PROJECT_ID = "kzuaiqlthsydwcazldvk";
