import { afterEach, describe, expect, it, vi } from "vitest";
import { installGlobalErrorMonitoring, reportFrontendError } from "./lib/errorMonitoring";

describe("frontend error monitoring", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports sanitized metadata without exposing full URLs", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    reportFrontendError(
      new Error("Échec de rendu https://private.example/path"),
      "error-boundary"
    );

    expect(consoleError).toHaveBeenCalledWith(
      "[Frontend Error]",
      expect.objectContaining({
        message: "Échec de rendu https://private.example/path",
        source: "error-boundary",
        path: window.location.pathname,
      })
    );
    expect(consoleError.mock.calls[0]?.[1].stack).not.toContain("https://");
  });

  it("installs and removes global browser listeners safely", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");

    const cleanup = installGlobalErrorMonitoring();
    cleanup();

    expect(addEventListener).toHaveBeenCalledWith("error", expect.any(Function));
    expect(addEventListener).toHaveBeenCalledWith("unhandledrejection", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("error", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("unhandledrejection", expect.any(Function));
  });
});
