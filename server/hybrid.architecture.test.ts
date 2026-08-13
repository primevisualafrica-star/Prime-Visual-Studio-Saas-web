import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

describe("architecture hybride Supabase", () => {
  it("conserve le stockage géré pour les uploads et générations", async () => {
    const routers = await readFile(path.resolve(process.cwd(), "server/routers.ts"), "utf8");
    expect(routers).toContain("storagePut");
    expect(routers).toContain("getSupabaseActiveSubscription");
  });

  it("expose uniquement les variables publiques Supabase côté client", async () => {
    const client = await readFile(path.resolve(process.cwd(), "client/src/lib/supabase.ts"), "utf8");
    expect(client).toContain("VITE_SUPABASE_URL");
    expect(client).toContain("VITE_SUPABASE_ANON_KEY");
    expect(client).not.toContain("service_role");
  });
});
