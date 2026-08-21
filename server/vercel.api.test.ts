import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Vercel API entrypoint", () => {
  it("mounts the existing tRPC router and storage proxy", () => {
    const handler = readFileSync(resolve(import.meta.dirname, "./vercelHandler.ts"), "utf8");
    const catchAll = readFileSync(resolve(import.meta.dirname, "../api/[...path].ts"), "utf8");
    const explicit = readFileSync(resolve(import.meta.dirname, "../api/index.ts"), "utf8");

    expect(handler).toContain('createExpressMiddleware({');
    expect(handler).toContain('router: appRouter,');
    expect(handler).toContain('createContext,');
    expect(handler).toContain('instance.use("/api/trpc", trpcMiddleware);');
    expect(handler).toContain('instance.use("/trpc", trpcMiddleware);');
    expect(handler).toContain("registerStorageProxy(instance)");
    expect(handler).toContain("/api/manus-storage/");
    expect(catchAll).toContain('vercelHandler');
    expect(explicit).toContain('vercelHandler');
  });
});
