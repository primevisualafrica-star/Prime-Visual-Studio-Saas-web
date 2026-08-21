import { describe, expect, it } from "vitest";
import { normalizeGenerationMedia } from "./db";
import type { Generation } from "../drizzle/schema";

const generation: Generation = {
  id: 42,
  userId: 7,
  originalImageUrl: "/legacy/original.jpg",
  originalImageKey: "uploads/user 7/original.jpg",
  generatedImageUrl: "https://legacy.example/generated.jpg",
  generatedImageKey: "generated/user 7/final image.jpg",
  category: "Mode",
  scene: "African Lifestyle",
  templateId: null,
  status: "completed",
  creditsUsed: 1,
  errorMessage: null,
  createdAt: new Date("2026-08-21T00:00:00.000Z"),
  updatedAt: new Date("2026-08-21T00:00:00.000Z"),
};

describe("normalizeGenerationMedia", () => {
  it("rebuilds gallery URLs from durable storage keys", () => {
    const normalized = normalizeGenerationMedia(generation);

    expect(normalized.originalImageUrl).toBe("/manus-storage/uploads/user%207/original.jpg");
    expect(normalized.generatedImageUrl).toBe("/manus-storage/generated/user%207/final%20image.jpg");
  });

  it("preserves a stored URL when its durable key is unavailable", () => {
    const normalized = normalizeGenerationMedia({
      ...generation,
      generatedImageKey: null,
    });

    expect(normalized.generatedImageUrl).toBe(generation.generatedImageUrl);
  });
});
