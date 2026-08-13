import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mocks.getUser },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => ({ maybeSingle: mocks.maybeSingle })),
            })),
          })),
        })),
      })),
    })),
  })),
}));

import { getSupabaseActiveSubscription, getSupabaseUser } from "./supabase";

describe("Supabase hybrid seams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts a valid Supabase bearer token and returns the user", async () => {
    const user = { id: "supabase-user-1", email: "user@example.com" };
    mocks.getUser.mockResolvedValueOnce({ data: { user }, error: null });

    await expect(getSupabaseUser("valid-token")).resolves.toEqual(user);
    expect(mocks.getUser).toHaveBeenCalledWith("valid-token");
  });

  it("reads the active subscription for the authenticated Supabase user", async () => {
    const subscription = { id: "sub-1", user_id: "supabase-user-1", plan: "STARTER", status: "active" };
    mocks.maybeSingle.mockResolvedValueOnce({ data: subscription, error: null });

    await expect(getSupabaseActiveSubscription("supabase-user-1", "valid-token")).resolves.toEqual(subscription);
    expect(mocks.maybeSingle).toHaveBeenCalledOnce();
  });
});
