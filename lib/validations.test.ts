import { describe, it, expect } from "vitest";

import { passwordSchema } from "@/lib/validations";

// Test « fumée » initial : valide que l'outillage de test fonctionne et couvre
// la règle métier la plus importante (mot de passe). Sera étoffé par la suite.
describe("passwordSchema", () => {
  it("accepte un mot de passe valide", () => {
    const result = passwordSchema.safeParse("Secret#123");
    expect(result.success).toBe(true);
  });

  it("refuse un mot de passe trop court", () => {
    const result = passwordSchema.safeParse("Ab#1");
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans caractère spécial", () => {
    const result = passwordSchema.safeParse("Secret123");
    expect(result.success).toBe(false);
  });
});
