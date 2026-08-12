import { generateImage } from "../_core/imageGeneration";

export type GenerateVisualInput = {
  prompt: string;
  originalImageUrl: string;
  mimeType: string;
};

export interface ImageGenerationService {
  generateVisual(input: GenerateVisualInput): Promise<{ url: string }>;
}

class ManagedImageGenerationService implements ImageGenerationService {
  async generateVisual(input: GenerateVisualInput) {
    const result = await generateImage({
      prompt: input.prompt,
      originalImages: [{ url: input.originalImageUrl, mimeType: input.mimeType }],
      model: "MODEL_GPT_IMAGE_2",
    });
    if (!result.url) throw new Error("Le fournisseur IA n'a pas renvoyé d'image.");
    return { url: result.url };
  }
}

export const imageGenerationService: ImageGenerationService = new ManagedImageGenerationService();

export function buildProductPrompt(category: string, scene: string, template: string) {
  return `${template}\n\nCatégorie : ${category}.\nScène : ${scene}.\n\nConserver exactement le produit principal, sa forme, ses proportions, ses matériaux et ses détails visuels. Ne pas inventer un autre produit. Créer une photographie commerciale réaliste avec une lumière professionnelle, des ombres naturelles et une composition premium. Le produit reste le sujet principal. Ne jamais ajouter de logo, marque ou texte qui n'existe pas.`;
}
