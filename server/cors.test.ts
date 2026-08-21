import { describe, expect, it } from "vitest";
import { isAllowedCorsOrigin } from "./_core/cors";

describe("CORS origin policy", () => {
  it("allows the canonical public Vercel origin", () => {
    expect(isAllowedCorsOrigin("https://prime-visual-studio-saas-web.vercel.app")).toBe(true);
  });

  it("allows local development and rejects unrelated origins", () => {
    expect(isAllowedCorsOrigin("http://localhost:3000")).toBe(true);
    expect(isAllowedCorsOrigin("https://evil.example")).toBe(false);
  });
});
