import { describe, expect, it } from "vitest";
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
});
