import { type DefaultSession } from "next-auth";

// Augmentation des types Auth.js pour exposer l'id et le nom d'utilisateur.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
}

// L'interface JWT est déclarée dans @auth/core/jwt et seulement réexportée par
// next-auth/jwt : on augmente donc le module d'origine pour que la fusion opère.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}
