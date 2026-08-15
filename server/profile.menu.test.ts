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

  it("provides an accessible previous-page control in the mobile dashboard header", () => {
    const layout = readProjectFile("client/src/components/DashboardLayout.tsx");
    expect(layout).toContain("ArrowLeft");
    expect(layout).toContain('aria-label="Retour à la page précédente"');
    expect(layout).toContain("window.history.back()");
    expect(layout).toContain('setLocation("/dashboard")');
  });
});
