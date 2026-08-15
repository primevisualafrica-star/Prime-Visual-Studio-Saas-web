import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { startLogin, startPasswordRecovery } from "@/const";

type AuthMode = "login" | "recovery";

type AuthDialogProps = {
  open: boolean;
  mode?: AuthMode;
  onOpenChange: (open: boolean) => void;
};

export default function AuthDialog({ open, mode = "login", onOpenChange }: AuthDialogProps) {
  const [email, setEmail] = useState("");
  const [activeMode, setActiveMode] = useState<AuthMode>(mode);
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setActiveMode(mode);
    setStatus(null);
    setEmail("");
  }, [open, mode]);

  const isRecovery = activeMode === "recovery";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const result = isRecovery ? await startPasswordRecovery(email) : await startLogin(email);
    setSubmitting(false);

    if (!result.ok) {
      setStatus({ type: "error", message: result.message ?? "Une erreur est survenue. Réessayez." });
      return;
    }

    setStatus({ type: "success", message: result.message ?? "Vérifiez votre boîte e-mail." });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-[#241846]/10 bg-[#fbfaf6] text-[#241846] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRecovery ? "Réinitialiser votre accès" : "Commencer avec Prime Visual"}</DialogTitle>
          <DialogDescription className="text-[#241846]/60">
            {isRecovery
              ? "Recevez un lien sécurisé pour réinitialiser votre accès."
              : "Entrez votre adresse e-mail pour recevoir un lien de connexion sécurisé."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Adresse e-mail</Label>
            <Input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={submitting}
              className="h-12 rounded-2xl border-[#241846]/15 bg-white"
            />
          </div>

          {status && (
            <p
              role="status"
              className={`rounded-2xl px-4 py-3 text-sm ${
                status.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {status.message}
            </p>
          )}

          <DialogFooter className="gap-3 sm:flex-col">
            <Button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[#241846] text-white hover:bg-[#39286b]">
              {submitting ? "Envoi en cours…" : isRecovery ? "Envoyer le lien" : "Recevoir mon lien"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={submitting}
              onClick={() => {
                setActiveMode(isRecovery ? "login" : "recovery");
                setStatus(null);
              }}
              className="w-full rounded-full text-[#241846]/65"
            >
              {isRecovery ? "Retour à la connexion" : "Mot de passe oublié ?"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
