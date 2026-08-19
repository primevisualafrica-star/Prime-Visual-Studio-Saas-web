import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolve } from "node:path";

const homeSource = readFileSync(resolve(import.meta.dirname, "../client/src/pages/Home.tsx"), "utf8");

describe("landing page footer", () => {
  it("keeps a visible, high-contrast French footer", () => {
    expect(homeSource).toContain("<footer className=\"border-t border-white/10 bg-[#241846]");
    expect(homeSource).toContain("Prime Visual AI Studio");
    expect(homeSource).toContain("Créé pour les entrepreneurs africains.");
    expect(homeSource).toContain("sm:flex-row sm:items-center sm:justify-between");
  });
});
