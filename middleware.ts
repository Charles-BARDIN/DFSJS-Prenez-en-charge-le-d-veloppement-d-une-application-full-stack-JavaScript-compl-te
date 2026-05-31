import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

// Instance Auth.js edge-safe (sans Prisma) dédiée au middleware.
const { auth } = NextAuth(authConfig);

// Routes accessibles sans être connecté.
const PUBLIC_ROUTES = ["/", "/login", "/register"];

// Protège toutes les routes applicatives : un visiteur non connecté qui tente
// d'accéder à une page protégée est redirigé vers la page de connexion.
export default auth((req) => {
  const isLoggedIn = Boolean(req.auth);
  const isPublic = PUBLIC_ROUTES.includes(req.nextUrl.pathname);

  if (!isLoggedIn && !isPublic) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  // Exclut les endpoints d'API (dont Auth.js), les fichiers statiques et les images.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
