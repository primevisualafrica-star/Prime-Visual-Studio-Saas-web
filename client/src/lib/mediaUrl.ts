import { MANUS_BACKEND_ORIGIN } from "./apiOrigin";

export function resolveMediaUrl(
  value: string | null | undefined,
  hostname = typeof window !== "undefined" ? window.location.hostname : "",
): string | undefined {
  if (!value) return undefined;

  try {
    const parsed = new URL(value, "https://local.invalid");
    if (parsed.origin !== "https://local.invalid") return value;
    if (parsed.pathname.startsWith("/manus-storage/") && hostname.endsWith(".vercel.app")) {
      return `${MANUS_BACKEND_ORIGIN}${parsed.pathname}${parsed.search}`;
    }
    return value;
  } catch {
    return value;
  }
}
