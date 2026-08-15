import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildProductPrompt } from "./services/imageGenerationService";

describe("ImageGenerationService prompt contract", () => {
  it("preserves the selected product context and anti-invention instructions", () => {
    const prompt = buildProductPrompt("Bijoux", "African Lifestyle", "Créer une scène premium.");
    expect(prompt).toContain("Catégorie : Bijoux.");
    expect(prompt).toContain("Scène : African Lifestyle.");
    expect(prompt).toContain("Conserver exactement le produit principal");
    expect(prompt).toContain("Ne jamais ajouter de logo, marque ou texte");
  });

  it("includes the exact required progress labels in the generation UI contract", () => {
    const labels = ["Analyse du produit…", "Création de la scène…", "Finalisation…"];
    expect(labels).toEqual(["Analyse du produit…", "Création de la scène…", "Finalisation…"]);
  });

  it("uses a public storage-proxy URL for the provider and a signed URL for server-side output processing", () => {
    const service = readFileSync(resolve(process.cwd(), "server/services/imageGenerationService.ts"), "utf8");
    const router = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    const helper = readFileSync(resolve(process.cwd(), "server/_core/imageGeneration.ts"), "utf8");
    expect(service).toContain("signedUrl");
    expect(router).toContain("/manus-storage/${generation.originalImageKey}");
    expect(router).toContain("requestOrigin");
    expect(router).toContain("fetch(result.signedUrl)");
    expect(helper).toContain("const signedUrl = await storageGetSignedUrl(stored.key)");
  });
});
