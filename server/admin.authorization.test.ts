import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("admin authorization", () => {
  it("rejects a regular authenticated user", async () => {
    const ctx: TrpcContext = {
      user: { id: 2, openId: "regular", name: "Utilisateur", email: "user@example.com", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    await expect(appRouter.createCaller(ctx).admin.stats()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
