import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { authorize } from "@/features/auth/authorize";

/**
 * Instance complète Auth.js (NextAuth v5).
 * - Reprend la configuration edge-safe (authConfig) et y ajoute le provider
 *   Credentials, qui accède à la base de données (donc hors edge runtime).
 * - Connexion par e-mail OU nom d'utilisateur + mot de passe ; session JWT.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
      },
      authorize,
    }),
  ],
});
