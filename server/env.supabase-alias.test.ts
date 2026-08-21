import { afterEach, describe, expect, it, vi } from "vitest";

describe("server Supabase environment aliases", () => {
  const original = {
    viteUrl: process.env.VITE_SUPABASE_URL,
    viteKey: process.env.VITE_SUPABASE_ANON_KEY,
    nextUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    nextKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  };

  afterEach(() => {
    for (const [key, value] of Object.entries({
      VITE_SUPABASE_URL: original.viteUrl,
      VITE_SUPABASE_ANON_KEY: original.viteKey,
      NEXT_PUBLIC_SUPABASE_URL: original.nextUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: original.nextKey,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: original.publishableKey,
      SUPABASE_URL: original.supabaseUrl,
      SUPABASE_ANON_KEY: original.supabaseKey,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    vi.resetModules();
  });

  it("uses Vercel public aliases for server-side bearer validation", async () => {
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.VITE_SUPABASE_ANON_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "publishable-test-key";

    const { ENV } = await import("./_core/env");

    expect(ENV.supabaseUrl).toBe("https://example.supabase.co");
    expect(ENV.supabaseAnonKey).toBe("publishable-test-key");
  });
});
