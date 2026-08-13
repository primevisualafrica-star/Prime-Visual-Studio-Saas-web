import { supabase } from "@/lib/supabase";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Démarre une connexion ou une inscription Supabase par lien magique.
 * Le prompt est temporaire afin de conserver les boutons existants sans
 * introduire un nouveau écran avant la migration complète de l’interface.
 */
export const startLogin = async () => {
  const email = window.prompt("Entrez votre adresse e-mail pour recevoir votre lien de connexion :")?.trim();
  if (!email) return;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    window.alert(`Connexion impossible : ${error.message}`);
    return;
  }

  window.alert("Un lien de connexion vient d’être envoyé à votre adresse e-mail.");
};

export const startPasswordRecovery = async () => {
  const email = window.prompt("Entrez votre adresse e-mail pour réinitialiser votre mot de passe :")?.trim();
  if (!email) return;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });

  if (error) {
    window.alert(`Réinitialisation impossible : ${error.message}`);
    return;
  }

  window.alert("Le lien de réinitialisation vient d’être envoyé à votre adresse e-mail.");
};
