const PUBLIC_VERCEL_ORIGIN = "https://prime-visual-studio-saas-web.vercel.app";
const MANUS_ORIGIN = "https://primeai-idtu68mc.manus.space";

export function isAllowedCorsOrigin(origin: string | undefined) {
  if (!origin) return false;
  if (origin === PUBLIC_VERCEL_ORIGIN || origin === MANUS_ORIGIN) return true;
  if (/^https:\/\/prime-visual-studio-saas-[a-z0-9-]+-prime-visual-ai-studio\.vercel\.app$/i.test(origin)) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^https:\/\/3000-[a-z0-9-]+\.us2\.manus\.com\.puter$/i.test(origin)) return true;
  return false;
}

export function applyCorsHeaders(req: { headers: Record<string, string | string[] | undefined> }, res: { setHeader: (name: string, value: string) => void }) {
  const originHeader = req.headers.origin;
  const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;
  if (!origin || !isAllowedCorsOrigin(origin)) return false;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  return true;
}
