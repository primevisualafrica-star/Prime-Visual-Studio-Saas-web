import { describe, expect, it } from "vitest";

describe("Supabase connection configuration", () => {
  it("reaches the configured Supabase REST endpoint with the public key", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    expect(url).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/);
    expect(key).toMatch(/^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/);

    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key!,
        Authorization: `Bearer ${key}`,
      },
    });

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});
