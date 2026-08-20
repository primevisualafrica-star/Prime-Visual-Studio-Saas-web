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

  it("handles Supabase email rate limits with a retry message and cooldown", () => {
    const auth = readProjectFile("client/src/const.ts");
    const dialog = readProjectFile("client/src/components/AuthDialog.tsx");
    expect(auth).toContain("over_email_send_rate_limit");
    expect(auth).toContain("Attendez ${retryAfterSeconds} secondes");
    expect(dialog).toContain("prime-auth-cooldown");
    expect(dialog).toContain("disabled={submitting || (isRecovery && cooldown > 0)}");
    expect(dialog).toContain("Réessayez dans");
  });

  it("uses direct password sign-in and keeps confirmation only for new accounts", () => {
    const auth = readProjectFile("client/src/const.ts");
    const dialog = readProjectFile("client/src/components/AuthDialog.tsx");
    expect(auth).toContain("signInWithPassword");
    expect(auth).toContain("export const startSignup");
    expect(auth).toContain("emailRedirectTo: confirmationRedirect");
    expect(dialog).toContain("Connectez-vous immédiatement");
    expect(dialog).toContain("Créer un compte");
    expect(dialog).toContain('type={showPassword ? "text" : "password"}');
    expect(dialog).toContain("Afficher le mot de passe");
    expect(dialog).toContain("Masquer le mot de passe");
    expect(dialog).toContain("aria-pressed={showPassword}");
    expect(auth).not.toContain("signInWithOtp");
  });

  it("requests confirmation for new accounts with a production-safe callback", () => {
    const auth = readProjectFile("client/src/const.ts");
    const dialog = readProjectFile("client/src/components/AuthDialog.tsx");
    expect(auth).toContain("startSignup");
    expect(auth).toContain("emailRedirectTo: confirmationRedirect");
    expect(dialog).toContain("Vérifiez votre boîte e-mail");
  });

  it("keeps the public bundle renderable when Vercel misses Supabase variables", () => {
    const supabase = readProjectFile("client/src/lib/supabase.ts");
    const auth = readProjectFile("client/src/const.ts");
    const main = readProjectFile("client/src/main.tsx");
    const hook = readProjectFile("client/src/_core/hooks/useAuth.ts");

    expect(supabase).toContain("export const supabase: SupabaseClientType | null");
    expect(supabase).not.toContain("throw new Error");
    expect(auth).toContain("if (!supabase)");
    expect(auth).toContain("SUPABASE_CONFIG_ERROR");
    expect(main).toContain("if (supabase)");
    expect(hook).toContain("if (!supabase) {");
    expect(hook).toContain("setSupabaseSessionReady(true)");
  });
});
