import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("storage proxy provider compatibility", () => {
  it("streams storage bytes instead of redirecting providers to a private signed URL", () => {
    const source = readFileSync(resolve(process.cwd(), "server/_core/storageProxy.ts"), "utf8");
    expect(source).toContain("const fileResp = await fetch(url)");
    expect(source).toContain("res.status(200).send(Buffer.from(await fileResp.arrayBuffer()))");
    expect(source).not.toContain("res.redirect(307, url)");
  });
});
