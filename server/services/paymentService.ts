export type PaymentPlan = "STARTER" | "BUSINESS";

export interface PaymentService {
  createCheckout(input: { userId: number; plan: PaymentPlan }): Promise<{ checkoutUrl: string }>;
}

/** Provider-neutral boundary for future mobile-money or card integrations. */
export const paymentService: PaymentService = {
  async createCheckout() {
    throw new Error("Le paiement sera disponible après la connexion d'un fournisseur.");
  },
};
