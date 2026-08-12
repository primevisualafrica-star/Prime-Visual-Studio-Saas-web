import { describe, expect, it } from "vitest";
import { canConsumeCredit } from "./db";

describe("credit guard", () => {
  it("allows consumption below the monthly limit", () => {
    expect(canConsumeCredit(4, 5)).toBe(true);
  });

  it("rejects consumption at the monthly limit", () => {
    expect(canConsumeCredit(5, 5)).toBe(false);
  });
});
