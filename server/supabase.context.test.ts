import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSupabaseUser: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  authenticateRequest: vi.fn(),
}));

vi.mock("./supabase", () => ({ getSupabaseUser: mocks.getSupabaseUser }));
vi.mock("./db", () => ({ upsertUser: mocks.upsertUser, getUserByOpenId: mocks.getUserByOpenId }));
vi.mock("./_core/sdk", () => ({ sdk: { authenticateRequest: mocks.authenticateRequest } }));

import { createContext } from "./_core/context";

const request = (authorization?: string) => ({
  req: { headers: authorization ? { authorization } : {} },
  res: { clearCookie: vi.fn() },
} as any);

describe("Supabase session context", () => {
  it("hydrates the internal user from a valid Supabase bearer token", async () => {
    const internalUser = { id: 7, openId: "supabase-user-1", loginMethod: "supabase", role: "user" };
    mocks.getSupabaseUser.mockResolvedValueOnce({ id: "supabase-user-1", email: "user@example.com", user_metadata: {} });
    mocks.getUserByOpenId.mockResolvedValueOnce(internalUser);

    const context = await createContext(request("Bearer valid-token"));

    expect(context.user).toEqual(internalUser);
    expect(context.supabaseAccessToken).toBe("valid-token");
    expect(mocks.upsertUser).toHaveBeenCalledOnce();
  });

  it("falls back to the existing session when the Supabase token is invalid", async () => {
    const internalUser = { id: 8, openId: "legacy-user", loginMethod: "manus", role: "user" };
    mocks.getSupabaseUser.mockResolvedValueOnce(null);
    mocks.authenticateRequest.mockResolvedValueOnce(internalUser);

    const context = await createContext(request("Bearer invalid-token"));

    expect(context.user).toEqual(internalUser);
    expect(context.supabaseAccessToken).toBeNull();
    expect(mocks.authenticateRequest).toHaveBeenCalledOnce();
  });
});
