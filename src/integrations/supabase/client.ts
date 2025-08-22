import { createClient } from '@supabase/supabase-js';

// --- Environment Variable Loading ---
const supabaseUrl = 'https://wpqcdhyhymtsvzmnrgud.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcWNkaHloeW10c3Z6bW5yZ3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzY3NzUsImV4cCI6MjA3MDY1Mjc3NX0.M_W0k7lkh4qu6xlg1PC8HAMo54mC7ozw7x-Y5bed3Uc';

// For other frameworks like Next.js, you would use:
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


// --- Runtime Validation ---
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anonymous key is missing from environment variables.");
}


// --- Client Initialization ---
// Create and export the Supabase client as a singleton instance.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Using localStorage is standard for web clients.
    storage: localStorage,
    // These are the recommended defaults for persistent sessions
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Add retry logic for failed token refreshes
    flowType: 'pkce'
  }
});