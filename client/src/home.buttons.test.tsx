import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./pages/Home";

const startLogin = vi.fn(() => Promise.resolve({ ok: true, message: "Lien envoyé" }));
const startPasswordRecovery = vi.fn(() => Promise.resolve({ ok: true, message: "Lien envoyé" }));
const startSignup = vi.fn(() => Promise.resolve({ ok: true, message: "Compte créé" }));
const mockAuth = vi.hoisted(() => ({
  user: null as null | { name: string; email: string },
  setLocation: vi.fn(),
}));

vi.mock("./const", () => ({
  startLogin: () => startLogin(),
  startPasswordRecovery: () => startPasswordRecovery(),
  startSignup: () => startSignup(),
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: mockAuth.user,
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
  useLocation: () => ["/", mockAuth.setLocation],
}));

describe("landing page button interactions", () => {
  afterEach(() => cleanup());
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.user = null;
  });

  async function submitAuthDialog(mode: "login" | "recovery" = "login") {
    const dialog = within(screen.getByRole("dialog"));
    fireEvent.change(dialog.getByLabelText(/adresse e-mail/i), {
      target: { value: "client@example.com" },
    });
    if (mode === "login") {
      fireEvent.change(dialog.getByLabelText("Mot de passe", { exact: true }), {
        target: { value: "password123" },
      });
      fireEvent.click(dialog.getByRole("button", { name: /se connecter/i }));
    } else {
      fireEvent.click(dialog.getByRole("button", { name: /envoyer le lien/i }));
    }
  }

  it("opens the login dialog from the visible CTA and submits login", async () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /commencer/i }));
    await submitAuthDialog();
    await waitFor(() => expect(startLogin).toHaveBeenCalledTimes(1));
  });

  it("routes an authenticated user directly to the studio from the primary creation CTA", () => {
    mockAuth.user = { name: "Client confirmé", email: "client@example.com" };
    render(<Home />);
    fireEvent.click(screen.getAllByRole("button", { name: /créer mon premier visuel/i })[0]);
    expect(mockAuth.setLocation).toHaveBeenCalledWith("/create");
    expect(startLogin).not.toHaveBeenCalled();
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

  it("opens the mobile menu and exposes working section links", () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    expect(screen.getByRole("navigation", { name: /navigation mobile/i })).toBeInTheDocument();
    expect(within(screen.getByRole("navigation", { name: /navigation mobile/i })).getByRole("link", { name: "Tarifs" })).toHaveAttribute("href", "#tarifs");
    fireEvent.click(screen.getByRole("button", { name: /fermer le menu/i }));
    expect(screen.queryByRole("navigation", { name: /navigation mobile/i })).not.toBeInTheDocument();
  });

  it("routes the authenticated mobile studio action directly to the studio", () => {
    mockAuth.user = { name: "Client confirmé", email: "client@example.com" };
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    fireEvent.click(screen.getByRole("button", { name: /ouvrir mon studio/i }));
    expect(mockAuth.setLocation).toHaveBeenCalledWith("/create");
  });
});
