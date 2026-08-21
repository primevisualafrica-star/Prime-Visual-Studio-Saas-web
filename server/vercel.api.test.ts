import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Vercel API entrypoint", () => {
  it("mounts the existing tRPC router and storage proxy", () => {
    const source = readFileSync(resolve(import.meta.dirname, "../api/[...path].ts"), "utf8");

    expect(source).toContain('createExpressMiddleware({');
    expect(source).toContain('router: appRouter,');
    expect(source).toContain('createContext,');
    expect(source).toContain('instance.use("/api/trpc", trpcMiddleware);');
    expect(source).toContain('instance.use("/trpc", trpcMiddleware);');
    expect(source).toContain("registerStorageProxy(instance)");
    expect(source).toContain("/api/manus-storage/");
  });
});
