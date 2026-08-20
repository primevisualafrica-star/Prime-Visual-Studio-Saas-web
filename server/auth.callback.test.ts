import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const callbackSource = fs.readFileSync(
  path.join(projectRoot, "client/src/components/AuthCallbackHandler.tsx"),
  "utf8",
);
const appSource = fs.readFileSync(path.join(projectRoot, "client/src/App.tsx"), "utf8");
const constSource = fs.readFileSync(path.join(projectRoot, "client/src/const.ts"), "utf8");

describe("Supabase confirmation-link flow", () => {
  it("mounts a global callback handler around the router", () => {
    expect(appSource).toContain("AuthCallbackHandler");
    expect(appSource).toContain("<AuthCallbackHandler />");
  });

  it("recognizes code, token, type, and error callback parameters", () => {
    expect(callbackSource).toContain('url.searchParams.get("code")');
    expect(callbackSource).toContain('hash.get("access_token")');
    expect(callbackSource).toContain('hash.get("type")');
    expect(callbackSource).toContain('url.searchParams.get("error")');
  });

  it("cleans callback credentials and returns non-root callbacks to the landing page", () => {
    expect(callbackSource).toContain('url.search = ""');
    expect(callbackSource).toContain('url.hash = ""');
    expect(callbackSource).toContain('window.location.replace("/")');
    expect(callbackSource).toContain("Connexion confirmée");
    expect(callbackSource).toContain("invalide ou a expiré");
  });

  it("sends both login and recovery links back to the site origin", () => {
    expect(constSource).toContain("signUp({");
    expect(constSource).toContain("signInWithPassword");
    expect(constSource).toContain("emailRedirectTo: window.location.origin");
    expect(constSource).toContain("resetPasswordForEmail");
    expect(constSource).toContain("redirectTo: window.location.origin");
  });
});
