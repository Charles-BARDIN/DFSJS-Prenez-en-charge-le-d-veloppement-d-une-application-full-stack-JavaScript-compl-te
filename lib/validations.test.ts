import { describe, it, expect } from "vitest";

import {
  passwordSchema,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createArticleSchema,
  createCommentSchema,
} from "@/lib/validations";

// Valeurs réutilisées dans plusieurs tests.
const VALID_PASSWORD = "Secret#123";

describe("passwordSchema", () => {
  it("accepte un mot de passe respectant toutes les règles", () => {
    expect(passwordSchema.safeParse(VALID_PASSWORD).success).toBe(true);
  });

  it("refuse un mot de passe de moins de 8 caractères", () => {
    expect(passwordSchema.safeParse("Ab#1").success).toBe(false);
  });

  it("refuse un mot de passe sans chiffre", () => {
    expect(passwordSchema.safeParse("Secret#abc").success).toBe(false);
  });

  it("refuse un mot de passe sans minuscule", () => {
    expect(passwordSchema.safeParse("SECRET#123").success).toBe(false);
  });

  it("refuse un mot de passe sans majuscule", () => {
    expect(passwordSchema.safeParse("secret#123").success).toBe(false);
  });

  it("refuse un mot de passe sans caractère spécial", () => {
    expect(passwordSchema.safeParse("Secret123").success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validInput = {
    email: "user@example.com",
    username: "john_doe",
    password: VALID_PASSWORD,
  };

  it("accepte une inscription valide", () => {
    expect(registerSchema.safeParse(validInput).success).toBe(true);
  });

  it("refuse un e-mail invalide", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      email: "pas-un-email",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un nom d'utilisateur trop court", () => {
    const result = registerSchema.safeParse({ ...validInput, username: "ab" });
    expect(result.success).toBe(false);
  });

  it("refuse un nom d'utilisateur trop long", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "a".repeat(31),
    });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe non conforme", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "faible",
    });
    expect(result.success).toBe(false);
  });

  it("nettoie les espaces autour de l'e-mail et du nom d'utilisateur", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      email: "  user@example.com  ",
      username: "  john_doe  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
      expect(result.data.username).toBe("john_doe");
    }
  });
});

describe("loginSchema", () => {
  it("accepte un identifiant et un mot de passe non vides", () => {
    const result = loginSchema.safeParse({
      identifier: "john_doe",
      password: "peu-importe",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un identifiant vide", () => {
    const result = loginSchema.safeParse({ identifier: "", password: "x" });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe vide", () => {
    const result = loginSchema.safeParse({ identifier: "john", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  const base = { email: "user@example.com", username: "john_doe" };

  it("accepte une mise à jour sans mot de passe (champ omis)", () => {
    expect(updateProfileSchema.safeParse(base).success).toBe(true);
  });

  it("accepte une chaîne vide comme mot de passe (inchangé)", () => {
    const result = updateProfileSchema.safeParse({ ...base, password: "" });
    expect(result.success).toBe(true);
  });

  it("accepte un nouveau mot de passe valide", () => {
    const result = updateProfileSchema.safeParse({
      ...base,
      password: VALID_PASSWORD,
    });
    expect(result.success).toBe(true);
  });

  it("refuse un nouveau mot de passe non conforme", () => {
    const result = updateProfileSchema.safeParse({
      ...base,
      password: "faible",
    });
    expect(result.success).toBe(false);
  });
});

describe("createArticleSchema", () => {
  const validInput = {
    topicId: "topic-1",
    title: "Mon titre",
    content: "Le contenu de l'article.",
  };

  it("accepte un article valide", () => {
    expect(createArticleSchema.safeParse(validInput).success).toBe(true);
  });

  it("refuse un thème manquant", () => {
    const result = createArticleSchema.safeParse({ ...validInput, topicId: "" });
    expect(result.success).toBe(false);
  });

  it("refuse un titre vide", () => {
    const result = createArticleSchema.safeParse({ ...validInput, title: "  " });
    expect(result.success).toBe(false);
  });

  it("refuse un titre de plus de 200 caractères", () => {
    const result = createArticleSchema.safeParse({
      ...validInput,
      title: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("refuse un contenu vide", () => {
    const result = createArticleSchema.safeParse({
      ...validInput,
      content: "   ",
    });
    expect(result.success).toBe(false);
  });
});

describe("createCommentSchema", () => {
  const validInput = { articleId: "article-1", content: "Bien vu !" };

  it("accepte un commentaire valide", () => {
    expect(createCommentSchema.safeParse(validInput).success).toBe(true);
  });

  it("refuse un article manquant", () => {
    const result = createCommentSchema.safeParse({
      ...validInput,
      articleId: "",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un commentaire vide", () => {
    const result = createCommentSchema.safeParse({
      ...validInput,
      content: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un commentaire de plus de 1000 caractères", () => {
    const result = createCommentSchema.safeParse({
      ...validInput,
      content: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});
