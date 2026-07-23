import { createClient } from "@supabase/supabase-js";

// Publishable (anon) key — safe to ship in the browser.
const SUPABASE_URL = "https://kzuaiqlthsydwcazldvk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dWFpcWx0aHN5ZHdjYXpsZHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTYzOTYsImV4cCI6MjEwMDM3MjM5Nn0.HduhjTtSV2L5WsF_HIIAPRdgCYERUDhoO3ULn_w_9Nk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export const SUPABASE_PROJECT_ID = "kzuaiqlthsydwcazldvk";
