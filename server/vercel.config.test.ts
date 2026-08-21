import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("Vercel deployment configuration", () => {
  it("serves the compiled Vite output with SPA routing", () => {
    const config = JSON.parse(readFileSync(resolve(projectRoot, "vercel.json"), "utf8"));

    expect(config.buildCommand).toBe("pnpm build");
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.rewrites).toEqual([
      { source: "/manus-storage/:path*", destination: "/api/manus-storage/:path*" },
      { source: "/(.*)", destination: "/index.html" },
    ]);
  });

  it("keeps the Vercel entry HTML free of unresolved analytics placeholders", () => {
    const html = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");

    expect(html).toContain('<html lang="fr">');
    expect(html).toContain('<div id="root"></div>');
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%");
    expect(html).not.toContain("%VITE_ANALYTICS_WEBSITE_ID%");
  });
});

