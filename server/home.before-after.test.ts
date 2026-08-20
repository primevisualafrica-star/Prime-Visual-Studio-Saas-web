import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("landing page before/after product showcase", () => {
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

  it("references the supplied before and after assets", () => {
    expect(home).toContain("https://primeai-idtu68mc.manus.space/manus-storage/prime-visual-avant_bdd30eb9.jpg");
    expect(home).toContain("https://primeai-idtu68mc.manus.space/manus-storage/prime-visual-apres_6fc9f84d.webp");
    expect(home).not.toContain('src="/manus-storage/prime-visual-avant_fb0d1ab1.jpg"');
    expect(home).not.toContain('src="/manus-storage/prime-visual-apres_2cbaa59c.webp"');
    expect(home).toContain("Avant — photo produit originale");
    expect(home).toContain("Après — visuel produit Prime Visual Africa");
  });

  it("includes an animated comparison with reduced-motion support", () => {
    expect(home).toContain("before-after-overlay");
    expect(home).toContain("before-after-divider");
    expect(css).toContain("@keyframes before-after-reveal");
    expect(css).toContain("0%, 12% { width: 100%; }");
    expect(css).toContain("88%, 100% { width: 0%; }");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});
