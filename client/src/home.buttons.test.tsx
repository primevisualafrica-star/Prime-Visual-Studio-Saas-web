import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./pages/Home";

const startLogin = vi.fn(() => Promise.resolve({ ok: true, message: "Lien envoyé" }));
const startPasswordRecovery = vi.fn(() => Promise.resolve({ ok: true, message: "Lien envoyé" }));
const startSignup = vi.fn(() => Promise.resolve({ ok: true, message: "Compte créé" }));

vi.mock("./const", () => ({
  startLogin: () => startLogin(),
  startPasswordRecovery: () => startPasswordRecovery(),
  startSignup: () => startSignup(),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    error: null,
    refresh: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("landing page button interactions", () => {
  afterEach(() => cleanup());
  beforeEach(() => vi.clearAllMocks());

  async function submitAuthDialog(mode: "login" | "recovery" = "login") {
    fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
      target: { value: "client@example.com" },
    });
    if (mode === "login") {
      fireEvent.change(screen.getByLabelText(/mot de passe/i), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    } else {
      fireEvent.click(screen.getByRole("button", { name: /envoyer le lien/i }));
    }
  }

  it("opens the login dialog from the visible CTA and submits login", async () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /commencer/i }));
    await submitAuthDialog();
    await waitFor(() => expect(startLogin).toHaveBeenCalledTimes(1));
  });

  it("opens the login dialog from the header sign-in button and submits login", async () => {
    render(<Home />);
    fireEvent.click(screen.getAllByRole("button", { name: /se connecter/i })[0]);
    await submitAuthDialog();
    await waitFor(() => expect(startLogin).toHaveBeenCalledTimes(1));
  });

  it("opens recovery from the explicit header action and submits recovery", async () => {
    render(<Home />);
    fireEvent.click(screen.getAllByRole("button", { name: /mot de passe oublié/i })[0]);
    await submitAuthDialog("recovery");
    await waitFor(() => expect(startPasswordRecovery).toHaveBeenCalledTimes(1));
  });
});
