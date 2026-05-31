import type { NextAuthConfig } from "next-auth";

/**
 * Configuration Auth.js **compatible edge runtime** (sans Prisma ni bcrypt),
 * partagée entre le middleware et l'instance complète (auth.ts).
 * Le provider Credentials (qui accède à la base) est ajouté dans auth.ts.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    // Au login, on persiste l'identifiant et le nom d'utilisateur dans le token.
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.username = user.name as string;
      }
      return token;
    },
    // On expose ces informations côté session (accessibles via auth()).
    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },
} satisfies NextAuthConfig;
