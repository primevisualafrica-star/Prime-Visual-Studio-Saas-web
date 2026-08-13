import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function getSupabaseUser(accessToken: string) {
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user;
}

export async function getSupabaseActiveSubscription(userId: string, accessToken: string) {
  const userClient = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const { data, error } = await userClient
    .from("subscriptions")
    .select("id, user_id, plan, status, started_at, expires_at, created_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("[Supabase Subscription] Failed to read subscription:", error.message);
    return null;
  }

  return data;
}
