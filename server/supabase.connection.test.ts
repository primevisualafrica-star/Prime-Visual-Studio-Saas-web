import { describe, expect, it } from "vitest";

describe("Supabase connection configuration", () => {
  it("reaches the configured Supabase Auth endpoint with the publishable key", async () => {
    const url = process.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    expect(url).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co$/);
    expect(key).toMatch(/^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/);

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: key!,
      },
    });

    expect(response.status).toBe(200);
  });
});
