import { SUPABASE_CONFIG_ERROR, supabase } from "@/lib/supabase";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

type AuthActionResult = { ok: boolean; message?: string; retryAfterSeconds?: number };

const DEFAULT_AUTH_RETRY_SECONDS = 60;

function normalizeAuthError(message: string): AuthActionResult {
  const normalized = message.toLowerCase();
  const isRateLimited = normalized.includes("rate limit") || normalized.includes("too many") || normalized.includes("over_email_send_rate_limit");
  if (!isRateLimited) return { ok: false, message };

  const secondsMatch = message.match(/(\d+)\s*(?:seconds?|secondes?)/i);
  const retryAfterSeconds = secondsMatch ? Math.max(30, Number(secondsMatch[1])) : DEFAULT_AUTH_RETRY_SECONDS;
  return {
    ok: false,
    retryAfterSeconds,
    message: `Supabase limite temporairement les e-mails de connexion. Attendez ${retryAfterSeconds} secondes avant de réessayer, ou utilisez le dernier lien reçu.`,
  };
}

/**
 * Envoie un lien magique Supabase. Le fallback prompt reste disponible pour
 * les intégrations legacy, mais l’interface utilise désormais AuthDialog.
 */
export const startLogin = async (providedEmail?: string): Promise<AuthActionResult> => {
  const email = (providedEmail ?? window.prompt("Entrez votre adresse e-mail pour recevoir votre lien de connexion :"))?.trim();
  if (!email) {
    return { ok: false, message: "Veuillez saisir une adresse e-mail pour continuer." };
  }

  if (!supabase) {
    return { ok: false, message: SUPABASE_CONFIG_ERROR };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    const normalized = normalizeAuthError(error.message);
    return normalized.message === error.message ? { ok: false, message: `Connexion impossible : ${error.message}` } : normalized;
  }

  return {
    ok: true,
    retryAfterSeconds: DEFAULT_AUTH_RETRY_SECONDS,
    message: "Un lien de connexion vient d’être envoyé. Attendez une minute avant de demander un nouveau lien.",
  };
};

export const startPasswordRecovery = async (providedEmail?: string): Promise<AuthActionResult> => {
  const email = (providedEmail ?? window.prompt("Entrez votre adresse e-mail pour réinitialiser votre mot de passe :"))?.trim();
  if (!email) {
    return { ok: false, message: "Veuillez saisir une adresse e-mail pour réinitialiser votre mot de passe." };
  }

  if (!supabase) {
    return { ok: false, message: SUPABASE_CONFIG_ERROR };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });

  if (error) {
    const normalized = normalizeAuthError(error.message);
    return normalized.message === error.message ? { ok: false, message: `Réinitialisation impossible : ${error.message}` } : normalized;
  }

  return {
    ok: true,
    retryAfterSeconds: DEFAULT_AUTH_RETRY_SECONDS,
    message: "Le lien de réinitialisation vient d’être envoyé. Attendez une minute avant de demander un nouveau lien.",
  };
};
