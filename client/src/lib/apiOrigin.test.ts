import { describe, expect, it } from "vitest";
import { getApiBaseUrl } from "./apiOrigin";

describe("getApiBaseUrl", () => {
  it("uses the existing Manus backend for Vercel hosts", () => {
    expect(getApiBaseUrl("prime-visual-studio-saas-web.vercel.app")).toBe(
      "https://primeai-idtu68mc.manus.space/api/trpc"
    );
  });

  it("uses the local same-origin API outside Vercel", () => {
    expect(getApiBaseUrl("localhost")).toBe("/api/trpc");
  });
});
