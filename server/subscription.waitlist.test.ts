import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("subscription waitlist and rolling free quota", () => {
  it("uses a stable rolling-24-hour usage window and exposes resetAt", () => {
    const router = projectFile("server/routers.ts");
    const db = projectFile("server/db.ts");
    expect(router).toContain('const quotaWindowKey = () => "rolling-24h";');
    expect(router).toContain("resetAt: row?.resetAt?.toISOString() ?? null");
    expect(db).toContain("DATE_ADD(NOW(), INTERVAL 24 HOUR)");
  });

  it("offers the paid-plan waitlist with validated name and email fields", () => {
    const router = projectFile("server/routers.ts");
    const studio = projectFile("client/src/pages/Studio.tsx");
    expect(router).toContain("joinWaitlist");
    expect(router).toContain('z.enum(["STARTER", "BUSINESS"])');
    expect(studio).toContain("Rejoindre la liste d’attente");
    expect(studio).toContain('type="email"');
    expect(studio).toContain('id="waitlist-name"');
    expect(studio).toContain('id="waitlist-email"');
  });

  it("describes FREE credits as resetting every 24 hours", () => {
    const studio = projectFile("client/src/pages/Studio.tsx");
    expect(studio).toContain("5 générations toutes les 24 h");
    expect(studio).toContain("Prochain renouvellement");
    expect(projectFile("server/routers.ts")).toContain("5 générations toutes les 24 h");
  });
});

// Keep the schema contract explicit so a future refactor does not remove the persistence fields.
it("persists waitlist and quota reset fields", () => {
  const schema = projectFile("drizzle/schema.ts");
  expect(schema).toContain("subscriberWaitlist");
  expect(schema).toContain("resetAt");
});
