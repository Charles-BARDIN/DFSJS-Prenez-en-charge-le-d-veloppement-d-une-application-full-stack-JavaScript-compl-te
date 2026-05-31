import { z } from "zod";

/**
 * Schémas de validation Zod centralisés.
 * Source de vérité unique des règles métier, réutilisée par les Server Actions
 * (validation côté serveur) et les formulaires (retour d'erreurs côté client).
 */

/**
 * Mot de passe : au moins 8 caractères, dont au moins un chiffre, une minuscule,
 * une majuscule et un caractère spécial (cf. spécifications fonctionnelles).
 */
export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule.")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
  .regex(
    /[^A-Za-z0-9]/,
    "Le mot de passe doit contenir au moins un caractère spécial.",
  );

const emailSchema = z
  .string()
  .trim()
  .min(1, "L'adresse e-mail est requise.")
  .email("L'adresse e-mail n'est pas valide.");

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
  .max(30, "Le nom d'utilisateur ne doit pas dépasser 30 caractères.");

/** Inscription : e-mail, nom d'utilisateur et mot de passe. */
export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

/** Connexion : identifiant (e-mail OU nom d'utilisateur) et mot de passe. */
export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "L'identifiant est requis."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

/**
 * Mise à jour du profil : e-mail, nom d'utilisateur et mot de passe optionnel
 * (renseigné uniquement pour le changer).
 */
export const updateProfileSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: z.union([passwordSchema, z.literal("")]).optional(),
});

/** Création d'un article : thème, titre et contenu (auteur et date automatiques). */
export const createArticleSchema = z.object({
  topicId: z.string().min(1, "Le thème est requis."),
  title: z
    .string()
    .trim()
    .min(1, "Le titre est requis.")
    .max(200, "Le titre ne doit pas dépasser 200 caractères."),
  content: z.string().trim().min(1, "Le contenu est requis."),
});

/** Ajout d'un commentaire : contenu uniquement (auteur et date automatiques). */
export const createCommentSchema = z.object({
  articleId: z.string().min(1, "L'article est requis."),
  content: z
    .string()
    .trim()
    .min(1, "Le commentaire ne peut pas être vide.")
    .max(1000, "Le commentaire ne doit pas dépasser 1000 caractères."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
