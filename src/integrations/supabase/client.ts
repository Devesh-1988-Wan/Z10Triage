import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types"; // your DB types (optional)

const SUPABASE_URL = "https://wpqcdhyhymtsvzmnrgud.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcWNkaHloeW10c3Z6bW5yZ3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzY3NzUsImV4cCI6MjA3MDY1Mjc3NX0.M_W0k7lkh4qu6xlg1PC8HAMo54mC7ozw7x-Y5bed3Uc";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage, // works across tabs
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
