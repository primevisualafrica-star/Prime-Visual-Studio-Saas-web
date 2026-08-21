import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

function hasAuthCallbackParams(url: URL) {
  const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
  return Boolean(
    url.searchParams.get("code") ||
      url.searchParams.get("error") ||
      hash.get("access_token") ||
      hash.get("refresh_token") ||
      hash.get("type") ||
      hash.get("error")
  );
}

function cleanAuthCallbackUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url;
}

/**
 * Consumes Supabase confirmation/magic-link returns. Supabase handles the
 * token exchange through detectSessionInUrl; this component owns the UX after
 * that exchange: return to `/`, remove tokens from browser history, and show a
 * French confirmation message while the existing profile menu reads the user.
 */
export default function AuthCallbackHandler() {
  useEffect(() => {
    const client = supabase;
    if (!client || typeof window === "undefined") return;

    const initialUrl = new URL(window.location.href);
    if (!hasAuthCallbackParams(initialUrl)) return;

    let redirected = false;
    let finishing = false;
    const finish = async () => {
      if (redirected || finishing) return;
      finishing = true;

      const code = initialUrl.searchParams.get("code");
      const exchanged = code ? await client.auth.exchangeCodeForSession(code) : null;
      const { data, error } = exchanged?.error
        ? { data: { session: null }, error: exchanged.error }
        : await client.auth.getSession();

      finishing = false;
      if (redirected) return;

      if (error || initialUrl.searchParams.get("error") || initialUrl.hash.includes("error")) {
        redirected = true;
        window.history.replaceState({}, document.title, cleanAuthCallbackUrl().pathname);
        toast.error("Le lien de confirmation est invalide ou a expiré. Demandez un nouveau lien.");
        return;
      }

      if (!data.session) return;
      redirected = true;
      const cleanUrl = cleanAuthCallbackUrl();
      if (cleanUrl.pathname !== "/") {
        window.location.replace("/");
        return;
      }
      window.history.replaceState({}, document.title, cleanUrl.pathname);
      toast.success("Connexion confirmée. Votre profil est maintenant disponible.");
    };

    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY")) void finish();
    });
    void finish();

    return () => listener.subscription.unsubscribe();
  }, []);

  return null;
}

export { hasAuthCallbackParams, cleanAuthCallbackUrl };
