import { supabase } from "@/lib/supabase";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

type AuthActionResult = { ok: boolean; message?: string };

/**
 * Envoie un lien magique Supabase. Le fallback prompt reste disponible pour
 * les intégrations legacy, mais l’interface utilise désormais AuthDialog.
 */
export const startLogin = async (providedEmail?: string): Promise<AuthActionResult> => {
  const email = (providedEmail ?? window.prompt("Entrez votre adresse e-mail pour recevoir votre lien de connexion :"))?.trim();
  if (!email) {
    return { ok: false, message: "Veuillez saisir une adresse e-mail pour continuer." };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    return { ok: false, message: `Connexion impossible : ${error.message}` };
  }

  return { ok: true, message: "Un lien de connexion vient d’être envoyé à votre adresse e-mail." };
};

export const startPasswordRecovery = async (providedEmail?: string): Promise<AuthActionResult> => {
  const email = (providedEmail ?? window.prompt("Entrez votre adresse e-mail pour réinitialiser votre mot de passe :"))?.trim();
  if (!email) {
    return { ok: false, message: "Veuillez saisir une adresse e-mail pour réinitialiser votre mot de passe." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });

  if (error) {
    return { ok: false, message: `Réinitialisation impossible : ${error.message}` };
  }

  return { ok: true, message: "Le lien de réinitialisation vient d’être envoyé à votre adresse e-mail." };
};
