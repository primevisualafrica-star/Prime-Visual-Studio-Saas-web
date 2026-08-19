import { createClient, type SupabaseClient as SupabaseClientType } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_CONFIG_ERROR =
  "Configuration Supabase manquante : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis dans Vercel.";

/**
 * Client public Supabase pour Auth et abonnements.
 * Les contrôles d’accès doivent rester dans Supabase RLS ; aucune clé service-role
 * ne doit être utilisée dans le navigateur.
 *
 * The client is optional on purpose: a missing Vercel variable must not prevent
 * the public landing page from mounting. Auth actions surface the configuration
 * error at interaction time instead of crashing the whole React bundle.
 */
export const supabase: SupabaseClientType | null =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export type SupabaseClient = SupabaseClientType;
