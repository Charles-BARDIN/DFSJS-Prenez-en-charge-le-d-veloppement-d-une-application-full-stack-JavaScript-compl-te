import { describe, it, expect } from "vitest";

import { ok, fail } from "@/lib/action-result";

describe("ok", () => {
  it("construit un résultat de succès avec ses données", () => {
    expect(ok({ id: "1" })).toEqual({ success: true, data: { id: "1" } });
  });
});

describe("fail", () => {
  it("construit un résultat d'échec avec un message", () => {
    expect(fail("Erreur")).toEqual({ success: false, error: "Erreur" });
  });

  it("inclut les erreurs de champ quand elles sont fournies", () => {
    expect(fail("Invalide", { email: "requis" })).toEqual({
      success: false,
      error: "Invalide",
      fieldErrors: { email: "requis" },
    });
  });
});
