import { describe, it, expect } from "vitest";
import { resolveMediaUrl } from "./mediaUrl";
import { MANUS_BACKEND_ORIGIN } from "./apiOrigin";

describe("resolveMediaUrl", () => {
  it("returns undefined for empty inputs", () => {
    expect(resolveMediaUrl(null)).toBeUndefined();
    expect(resolveMediaUrl(undefined)).toBeUndefined();
    expect(resolveMediaUrl("")).toBeUndefined();
  });

  it("preserves absolute URLs", () => {
    expect(resolveMediaUrl("https://example.com/image.jpg")).toBe("https://example.com/image.jpg");
    expect(resolveMediaUrl("http://localhost:3000/image.jpg")).toBe("http://localhost:3000/image.jpg");
  });

  it("preserves relative URLs when not on Vercel", () => {
    expect(resolveMediaUrl("/manus-storage/image.jpg", "localhost")).toBe("/manus-storage/image.jpg");
    expect(resolveMediaUrl("/manus-storage/image.jpg", "manus.space")).toBe("/manus-storage/image.jpg");
  });

  it("rewrites relative manus-storage URLs to the Manus backend when on Vercel", () => {
    expect(resolveMediaUrl("/manus-storage/image.jpg", "my-app.vercel.app")).toBe(`${MANUS_BACKEND_ORIGIN}/manus-storage/image.jpg`);
    expect(resolveMediaUrl("/manus-storage/image.jpg?v=1", "my-app.vercel.app")).toBe(`${MANUS_BACKEND_ORIGIN}/manus-storage/image.jpg?v=1`);
  });

  it("preserves other relative URLs even on Vercel", () => {
    expect(resolveMediaUrl("/other-path/image.jpg", "my-app.vercel.app")).toBe("/other-path/image.jpg");
  });
});
