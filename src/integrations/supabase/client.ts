// src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// --- Environment Variable Loading ---
// Use `import.meta.env` for Vite-based projects (Vite, SvelteKit, Astro)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For other frameworks like Next.js, you would use:
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


// --- Runtime Validation ---
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anonymous key is missing from environment variables.");
}


// --- Client Initialization ---
// Create and export the Supabase client as a singleton instance.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Using localStorage is standard for web clients.
    storage: localStorage,
    // These are the recommended defaults, so they are good to keep.
    persistSession: true,
    autoRefreshToken: false,
  }
});