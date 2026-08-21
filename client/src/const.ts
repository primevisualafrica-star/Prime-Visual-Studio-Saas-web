import { SUPABASE_CONFIG_ERROR, supabase } from "@/lib/supabase";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

type AuthActionResult = { ok: boolean; message?: string; retryAfterSeconds?: number };

const DEFAULT_AUTH_RETRY_SECONDS = 60;

function normalizeAuthError(message: string): AuthActionResult {
  const normalized = message.toLowerCase();
  const isRateLimited = normalized.includes("rate limit") || normalized.includes("too many") || normalized.includes("over_email_send_rate_limit");
  if (normalized.includes("user already registered") || normalized.includes("already been registered")) {
    return { ok: false, message: "Cette adresse possède déjà un compte. Utilisez « Se connecter » avec votre mot de passe, ou « Mot de passe oublié ? » pour en créer un nouveau." };
  }
  if (normalized.includes("smtp") || normalized.includes("email provider") || normalized.includes("mail service")) {
    return { ok: false, message: "Supabase ne peut pas envoyer l’e-mail actuellement. Vérifiez le fournisseur SMTP du projet ou réessayez plus tard." };
  }
  if (!isRateLimited) return { ok: false, message };

  const secondsMatch = message.match(/(\d+)\s*(?:seconds?|secondes?)/i);
  const retryAfterSeconds = secondsMatch ? Math.max(30, Number(secondsMatch[1])) : DEFAULT_AUTH_RETRY_SECONDS;
  return {
    ok: false,
    retryAfterSeconds,
    message: `Supabase limite temporairement les e-mails de connexion. Attendez ${retryAfterSeconds} secondes avant de réessayer, ou utilisez le dernier lien reçu.`,
  };
}

function readCredentials(providedEmail?: string, providedPassword?: string) {
  const email = (providedEmail ?? window.prompt("Entrez votre adresse e-mail :"))?.trim();
  const password = providedPassword ?? window.prompt("Entrez votre mot de passe :");
  return { email, password };
}

/** Connexion immédiate pour les utilisateurs déjà inscrits. Aucun lien n’est envoyé. */
export const startLogin = async (providedEmail?: string, providedPassword?: string): Promise<AuthActionResult> => {
  const { email, password } = readCredentials(providedEmail, providedPassword);
  if (!email || !password) return { ok: false, message: "Veuillez saisir votre e-mail et votre mot de passe pour continuer." };
  if (!supabase) return { ok: false, message: SUPABASE_CONFIG_ERROR };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const normalized = normalizeAuthError(error.message);
    if (normalized.message !== error.message) return normalized;
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return { ok: false, message: "E-mail ou mot de passe incorrect. Utilisez « Mot de passe oublié ? » si vous devez créer un mot de passe." };
    }
    return { ok: false, message: `Connexion impossible : ${error.message}` };
  }
  return { ok: true, message: "Connexion réussie. Bienvenue sur Prime Visual Africa." };
};

/** Création d’un nouveau compte : Supabase peut demander une confirmation e-mail. */
export const startSignup = async (providedEmail?: string, providedPassword?: string): Promise<AuthActionResult> => {
  const { email, password } = readCredentials(providedEmail, providedPassword);
  if (!email || !password) return { ok: false, message: "Veuillez saisir un e-mail et un mot de passe pour créer votre compte." };
  if (password.length < 8) return { ok: false, message: "Votre mot de passe doit contenir au moins 8 caractères." };
  if (!supabase) return { ok: false, message: SUPABASE_CONFIG_ERROR };

  const confirmationRedirect = new URL("/", window.location.origin).toString();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: confirmationRedirect },
  });
  if (error) {
    const normalized = normalizeAuthError(error.message);
    return normalized.message === error.message ? { ok: false, message: `Création du compte impossible : ${error.message}` } : normalized;
  }
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { ok: false, message: "Cette adresse possède déjà un compte. Utilisez « Se connecter » avec votre mot de passe, ou « Mot de passe oublié ? » si nécessaire." };
  }
  if (!data.session) {
    return { ok: true, retryAfterSeconds: DEFAULT_AUTH_RETRY_SECONDS, message: "La demande de confirmation a été acceptée. Vérifiez la boîte de réception et les dossiers spam/promotions. Si cette adresse possède déjà un compte, aucun nouveau lien ne sera forcément renvoyé ; utilisez alors « Se connecter » ou « Mot de passe oublié ? »." };
  }
  return { ok: true, message: "Compte créé. Bienvenue sur Prime Visual Africa." };
};

export const startPasswordRecovery = async (providedEmail?: string): Promise<AuthActionResult> => {
  const email = (providedEmail ?? window.prompt("Entrez votre adresse e-mail pour réinitialiser votre mot de passe :"))?.trim();
  if (!email) return { ok: false, message: "Veuillez saisir une adresse e-mail pour réinitialiser votre mot de passe." };
  if (!supabase) return { ok: false, message: SUPABASE_CONFIG_ERROR };

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if (error) {
    const normalized = normalizeAuthError(error.message);
    return normalized.message === error.message ? { ok: false, message: `Réinitialisation impossible : ${error.message}` } : normalized;
  }
  return { ok: true, retryAfterSeconds: DEFAULT_AUTH_RETRY_SECONDS, message: "Le lien de réinitialisation vient d’être envoyé. Attendez une minute avant de demander un nouveau lien." };
};
