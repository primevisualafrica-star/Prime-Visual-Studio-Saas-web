import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(projectRoot, relativePath), "utf8");
}

describe("button destinations and feedback", () => {
  it("keeps the compatibility route for the public CTA destination", () => {
    const app = readProjectFile("client/src/App.tsx");
    expect(app).toContain('path="/studio"');
    expect(app).toContain('path="/dashboard"');
  });

  it("routes the primary creation CTA for authenticated users without reopening sign-in", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    expect(home).toContain("const openCreateStudio = () =>");
    expect(home).toContain('setLocation("/create")');
    expect(home).toContain("if (user)");
    expect(home).toContain("openLogin();");
    expect(home).toContain("onClick={openCreateStudio}");
  });

  it("defines explicit authentication feedback instead of silent no-op actions", () => {
    const auth = readProjectFile("client/src/const.ts");
    expect(auth).toMatch(/supabase\.auth\.(signInWithOtp|resetPasswordForEmail)/);
    expect(auth).toContain("message:");
    expect(auth).toContain("Promise<AuthActionResult>");
  });

  it("keeps explicit subscription actions in the private studio", () => {
    const studio = readProjectFile("client/src/pages/Studio.tsx");
    expect(studio).toMatch(/onClick=\{[^}]*handle|onClick=\{[^}]*toast|onClick=\{[^}]*create/);
    expect(studio).toContain("subscription");
  });
});
