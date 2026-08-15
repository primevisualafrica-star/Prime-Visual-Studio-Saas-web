import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("Vercel deployment configuration", () => {
  it("serves the compiled Vite output with SPA routing", () => {
    const config = JSON.parse(readFileSync(resolve(projectRoot, "vercel.json"), "utf8"));

    expect(config.buildCommand).toBe("pnpm build");
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.rewrites).toEqual([{ source: "/(.*)", destination: "/index.html" }]);
  });
});

