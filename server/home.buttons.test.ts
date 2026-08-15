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

  it("defines explicit authentication feedback instead of silent no-op actions", () => {
    const auth = readProjectFile("client/src/const.ts");
    expect(auth).toMatch(/supabase\.auth\.(signInWithOtp|resetPasswordForEmail)/);
    expect(auth).toMatch(/toast|alert|console\.error/);
  });

  it("keeps explicit subscription actions in the private studio", () => {
    const studio = readProjectFile("client/src/pages/Studio.tsx");
    expect(studio).toMatch(/onClick=\{[^}]*handle|onClick=\{[^}]*toast|onClick=\{[^}]*create/);
    expect(studio).toContain("subscription");
  });
});
