import { describe, expect, it } from "vitest";

describe("production Supabase frontend configuration", () => {
  it("can reach the Supabase Auth settings endpoint with the configured public key", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    expect(url).toBe("https://kgzblakzswkedlkandon.supabase.co");
    expect(key).toMatch(/^sb_publishable_/);

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key!, Authorization: `Bearer ${key}` },
    });

    expect(response.ok).toBe(true);
    const body = (await response.json()) as { external?: Record<string, unknown> };
    expect(body).toHaveProperty("external");
  });
});
