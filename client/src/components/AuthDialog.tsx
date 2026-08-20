import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { startLogin, startPasswordRecovery, startSignup } from "@/const";

type AuthMode = "login" | "signup" | "recovery";
type AuthStatus = { type: "error" | "success"; message: string } | null;

const AUTH_COOLDOWN_SECONDS = 60;
const cooldownKey = (mode: AuthMode, email: string) => `prime-auth-cooldown:${mode}:${email.toLowerCase()}`;

function readCooldown(mode: AuthMode, email: string) {
  if (!email || typeof window === "undefined") return 0;
  const stored = Number(window.localStorage.getItem(cooldownKey(mode, email)) ?? 0);
  return Number.isFinite(stored) ? Math.max(0, Math.ceil((stored - Date.now()) / 1000)) : 0;
}

function saveCooldown(mode: AuthMode, email: string, seconds: number) {
  if (!email || typeof window === "undefined") return;
  window.localStorage.setItem(cooldownKey(mode, email), String(Date.now() + seconds * 1000));
}

type AuthDialogProps = { open: boolean; mode?: "login" | "recovery"; onOpenChange: (open: boolean) => void };

export default function AuthDialog({ open, mode = "login", onOpenChange }: AuthDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeMode, setActiveMode] = useState<AuthMode>(mode);
  const [status, setStatus] = useState<AuthStatus>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!open) return;
    setActiveMode(mode);
    setStatus(null);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setCooldown(0);
  }, [open, mode]);

  useEffect(() => {
    if (!open || activeMode === "login") return;
    setCooldown(readCooldown(activeMode, email.trim()));
    const timer = window.setInterval(() => setCooldown(readCooldown(activeMode, email.trim())), 1000);
    return () => window.clearInterval(timer);
  }, [activeMode, email, open]);

  const isRecovery = activeMode === "recovery";
  const isSignup = activeMode === "signup";
  const cooldownLabel = useMemo(() => cooldown ? `Réessayez dans ${cooldown} seconde${cooldown === 1 ? "" : "s"}.` : "", [cooldown]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const existingCooldown = readCooldown(activeMode, trimmedEmail);
    if (existingCooldown > 0) {
      setCooldown(existingCooldown);
      setStatus({ type: "error", message: `Un e-mail vient déjà d’être demandé. ${cooldownLabel || `Réessayez dans ${existingCooldown} secondes.`}` });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    const result = isRecovery
      ? await startPasswordRecovery(trimmedEmail)
      : isSignup
        ? await startSignup(trimmedEmail, password)
        : await startLogin(trimmedEmail, password);
    setSubmitting(false);
    if (result.retryAfterSeconds) {
      saveCooldown(activeMode, trimmedEmail, result.retryAfterSeconds);
      setCooldown(result.retryAfterSeconds);
    }
    if (!result.ok) {
      setStatus({ type: "error", message: result.message ?? "Une erreur est survenue. Réessayez." });
      return;
    }
    if (!isSignup && !isRecovery) {
      onOpenChange(false);
      return;
    }
    setStatus({ type: "success", message: result.message ?? "Vérifiez votre boîte e-mail." });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-[#241846]/10 bg-[#fbfaf6] text-[#241846] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRecovery ? "Réinitialiser votre accès" : isSignup ? "Créer votre compte Prime Visual" : "Se connecter à Prime Visual"}</DialogTitle>
          <DialogDescription className="text-[#241846]/60">
            {isRecovery ? "Recevez un lien sécurisé pour créer un nouveau mot de passe." : isSignup ? "Créez votre compte avec un mot de passe. Une confirmation e-mail peut être demandée par Supabase." : "Connectez-vous immédiatement avec votre e-mail et votre mot de passe, sans recevoir de lien."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="auth-email">Adresse e-mail</Label><Input id="auth-email" name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={submitting} className="h-12 rounded-2xl border-[#241846]/15 bg-white" /></div>
          {!isRecovery && <div className="space-y-2"><Label htmlFor="auth-password">Mot de passe</Label><div className="relative"><Input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} placeholder="8 caractères minimum" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} disabled={submitting} className="h-12 rounded-2xl border-[#241846]/15 bg-white pr-12" /><button type="button" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} disabled={submitting} className="absolute inset-y-0 right-3 flex w-10 items-center justify-center rounded-full text-[#241846]/60 transition-colors hover:bg-[#241846]/5 hover:text-[#241846] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7aa3f] disabled:opacity-50">{showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}</button></div></div>}
          {status && <p role="status" className={`rounded-2xl px-4 py-3 text-sm ${status.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{status.message}</p>}
          <DialogFooter className="gap-3 sm:flex-col">
            <Button type="submit" disabled={submitting || (isRecovery && cooldown > 0)} className="h-12 w-full rounded-full bg-[#241846] text-white hover:bg-[#39286b]">{submitting ? "Traitement en cours…" : isRecovery ? cooldown > 0 ? cooldownLabel : "Envoyer le lien" : isSignup ? cooldown > 0 ? cooldownLabel : "Créer mon compte" : "Se connecter"}</Button>
            <div className="grid w-full gap-2 sm:grid-cols-2">
              <Button type="button" variant="ghost" disabled={submitting} onClick={() => { setActiveMode(isSignup ? "login" : "signup"); setStatus(null); setCooldown(0); }} className="w-full rounded-full text-[#241846]/65">{isSignup ? "Déjà un compte ?" : "Créer un compte"}</Button>
              {!isSignup && <Button type="button" variant="ghost" disabled={submitting} onClick={() => { setActiveMode(isRecovery ? "login" : "recovery"); setStatus(null); setCooldown(0); }} className="w-full rounded-full text-[#241846]/65">{isRecovery ? "Retour à la connexion" : "Mot de passe oublié ?"}</Button>}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AUTH_COOLDOWN_SECONDS };
