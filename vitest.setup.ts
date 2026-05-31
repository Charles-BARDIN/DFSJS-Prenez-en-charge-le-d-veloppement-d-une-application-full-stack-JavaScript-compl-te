import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Nettoie le DOM rendu après chaque test (évite les fuites entre tests).
afterEach(() => {
  cleanup();
});
