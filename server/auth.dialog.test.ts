import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("authentication dialog button flow", () => {
  it("uses a visible email dialog for public CTAs", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const dialog = readProjectFile("client/src/components/AuthDialog.tsx");

    expect(home).toContain('import AuthDialog from "@/components/AuthDialog";');
    expect(home).toContain("<AuthDialog open={authOpen}");
    expect(home).toContain("onClick={openLogin}");
    expect(dialog).toContain('id="auth-email"');
    expect(dialog).toContain("type=\"submit\"");
    expect(dialog).not.toContain("window.prompt");
  });

  it("keeps protected routes connected to the same dialog", () => {
    const layout = readProjectFile("client/src/components/DashboardLayout.tsx");
    expect(layout).toContain('import AuthDialog from "@/components/AuthDialog";');
    expect(layout).toContain("onClick={() => setAuthOpen(true)}");
    expect(layout).toContain("<AuthDialog open={authOpen}");
  });
});
