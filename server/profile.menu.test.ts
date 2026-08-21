import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("authenticated profile dropdown", () => {
  it("is rendered conditionally in the public navigation", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    expect(home).toContain('import ProfileMenu from "@/components/ProfileMenu";');
    expect(home).toContain('const { user } = useAuth();');
    expect(home).toContain("{user ? <ProfileMenu />");
  });

  it("provides accessible account navigation and logout actions", () => {
    const menu = readProjectFile("client/src/components/ProfileMenu.tsx");
    expect(menu).toContain("aria-label={`Ouvrir le profil de ${displayName}`}");
    expect(menu).toContain('setLocation("/dashboard")');
    expect(menu).toContain('setLocation("/profile")');
    expect(menu).toContain('setLocation("/subscription")');
    expect(menu).toContain("void logout()");
  });

  it("provides an accessible persistent landing-page control in the internal header", () => {
    const layout = readProjectFile("client/src/components/DashboardLayout.tsx");
    expect(layout).toContain("ArrowLeft");
    expect(layout).toContain('aria-label="Retour à la page d’accueil"');
    expect(layout).toContain('title="Retour à la page d’accueil"');
    expect(layout).toContain("sticky top-0 z-40");
    expect(layout).toContain('setLocation("/")');
    expect(layout).not.toContain("window.history.back()");
  });
});
