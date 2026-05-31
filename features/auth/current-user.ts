import { prisma } from "@/lib/prisma";

/**
 * ⚠️ IMPLÉMENTATION TEMPORAIRE (étape 5).
 *
 * Fournit un « utilisateur courant » pour développer les fonctionnalités qui en
 * dépendent (abonnements, articles, commentaires, profil) AVANT la mise en place
 * de l'authentification réelle (Auth.js) prévue à l'étape 6.
 *
 * À l'étape 6, le corps de cette fonction sera remplacé par la lecture de la
 * session Auth.js (`auth()`), sans modifier le code appelant. Le compte de
 * développement ci-dessous sera alors retiré.
 */
const DEV_USER = {
  email: "dev@mdd.local",
  username: "dev",
  // Aucune authentification n'est effectuée à l'étape 5 : ce champ n'est jamais
  // vérifié. Un vrai mot de passe haché sera mis en place avec Auth.js (étape 6).
  password: "non-applicable-en-developpement",
};

/** Retourne l'utilisateur courant (provisoirement, un compte de développement). */
export const getCurrentUser = () => {
  return prisma.user.upsert({
    where: { email: DEV_USER.email },
    update: {},
    create: DEV_USER,
  });
};
