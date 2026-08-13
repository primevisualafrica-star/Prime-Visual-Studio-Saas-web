import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getUserByOpenId, upsertUser } from "../db";
import { getSupabaseUser } from "../supabase";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  supabaseAccessToken: string | null;
};

function bearerToken(req: CreateExpressContextOptions["req"]) {
  const value = req.headers.authorization;
  if (!value?.startsWith("Bearer ")) return null;
  return value.slice("Bearer ".length).trim() || null;
}

async function authenticateSupabaseRequest(
  req: CreateExpressContextOptions["req"]
): Promise<{ user: User; accessToken: string } | null> {
  const accessToken = bearerToken(req);
  if (!accessToken) return null;

  const supabaseUser = await getSupabaseUser(accessToken);
  if (!supabaseUser) return null;

  const openId = supabaseUser.id;
  await upsertUser({
    openId,
    name: supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? null,
    email: supabaseUser.email ?? null,
    loginMethod: "supabase",
    lastSignedIn: new Date(),
  });

  const user = await getUserByOpenId(openId);
  return user ? { user, accessToken } : null;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let supabaseAccessToken: string | null = null;

  try {
    const authenticated = await authenticateSupabaseRequest(opts.req);
    if (authenticated) {
      user = authenticated.user;
      supabaseAccessToken = authenticated.accessToken;
    }
  } catch (error) {
    console.warn("[Supabase Auth] Request authentication failed:", error);
  }

  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    supabaseAccessToken,
  };
}
