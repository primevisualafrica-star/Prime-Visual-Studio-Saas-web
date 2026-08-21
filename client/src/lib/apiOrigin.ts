const MANUS_BACKEND_ORIGIN = "https://primeai-idtu68mc.manus.space";

export function getApiBaseUrl(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");
  if (configured) return `${configured}/api/trpc`;

  if (hostname.endsWith(".vercel.app")) {
    return `${MANUS_BACKEND_ORIGIN}/api/trpc`;
  }

  return "/api/trpc";
}

export { MANUS_BACKEND_ORIGIN };
