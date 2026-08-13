import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Configuration Supabase manquante : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis.");
}

/**
 * Client public Supabase pour Auth, Database et Storage.
 * Les contrôles d’accès doivent rester dans Supabase RLS ; aucune clé service-role
 * ne doit être utilisée dans le navigateur.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type SupabaseClient = typeof supabase;
