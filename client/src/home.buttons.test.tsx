import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./pages/Home";

const startLogin = vi.fn();
const startPasswordRecovery = vi.fn();

vi.mock("./const", () => ({
  startLogin: () => startLogin(),
  startPasswordRecovery: () => startPasswordRecovery(),
}));

vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("landing page button interactions", () => {
  afterEach(() => cleanup());
  beforeEach(() => vi.clearAllMocks());

  it("triggers login from the visible CTA", () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /commencer/i }));
    expect(startLogin).toHaveBeenCalledTimes(1);
  });

  it("triggers login from the header sign-in button", () => {
    render(<Home />);
    fireEvent.click(screen.getAllByRole("button", { name: /se connecter/i })[0]);
    expect(startLogin).toHaveBeenCalledTimes(1);
  });

  it("triggers password recovery from its explicit header action", () => {
    render(<Home />);
    fireEvent.click(screen.getAllByRole("button", { name: /mot de passe oublié/i })[0]);
    expect(startPasswordRecovery).toHaveBeenCalledTimes(1);
  });
});
