import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Prime Visual Africa logo reference", () => {
  it("uses the approved logo asset and accessible alt text in Home", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(home).toContain("/manus-storage/prime-visual-africa-logo-proposal_efaf6555.png");
    expect(home).toContain('alt="Prime Visual Africa"');
    expect(home).not.toContain("prime-visual-africa-logo-final_a8911f17.png");
  });
});
