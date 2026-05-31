import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Nettoie le DOM rendu après chaque test (évite les fuites entre tests).
afterEach(() => {
  cleanup();
});

// Composants Next.js remplacés par leurs équivalents HTML simples : ils ne sont
// pas résolus hors du runtime Next et n'apportent rien aux tests de rendu.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string }) =>
    React.createElement("img", { alt, ...props }),
}));
