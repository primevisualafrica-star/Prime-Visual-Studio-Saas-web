import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Landing page testimonials", () => {
  it("renders the three user-provided testimonials without fabricated replacements", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(home).toContain("Thandiwe Mokoena");
    expect(home).toContain("Ubuntu Wellness Co.");
    expect(home).toContain("Daniel Okafor");
    expect(home).toContain("NexaTech Solutions");
    expect(home).toContain("Lerato Khumalo");
    expect(home).toContain("Elevate Events & Media");
    expect(home).toContain("Prime Visual Africa a donné une nouvelle dimension à notre image de marque.");
    expect(home).toContain("Un service remarquable, des visuels de grande qualité et un résultat qui dépasse nos attentes.");
    expect(home).toContain("Prime Visual Africa a parfaitement donné vie à notre vision.");
  });
});
