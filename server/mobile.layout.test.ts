import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("mobile layout safeguards", () => {
  it("keeps global overflow and touch-friendly mobile rules", () => {
    const styles = readProjectFile("client/src/index.css");
    expect(styles).toContain("overflow-x:hidden");
    expect(styles).toContain("min-width:320px");
    expect(styles).toContain("min-height:3rem");
  });

  it("keeps the mobile dashboard shell compact and scrollable", () => {
    const layout = readProjectFile("client/src/components/DashboardLayout.tsx");
    expect(layout).toContain("h-10 w-10 rounded-xl");
    expect(layout).toContain("min-w-0 flex-1 px-3 py-4 pb-8 sm:p-6");
  });

  it("marks the public page for its dedicated mobile density rules", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    expect(home).toContain('className="marketing-page min-h-screen');
    expect(home).toContain('className="marketing-page');
  });

  it("opens the mobile photo-library picker for the primary product upload", () => {
    const studio = readProjectFile("client/src/pages/Studio.tsx");
    expect(studio).toContain('id="product-image-upload" type="file" accept="image/jpeg,image/png,image/webp"');
    expect(studio).not.toContain('id="product-image-upload" type="file" accept="image/jpeg,image/png,image/webp" capture=');
  });
});

