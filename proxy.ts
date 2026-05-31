import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

// Proxy Next.js 16 (ex-middleware) : s'exécute avant chaque requête pour protéger
// les routes. On instancie Auth.js à partir de la configuration légère (sans Prisma)
// afin de ne lire que la session (JWT) sans accéder à la base de données.
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
  // Exclut les endpoints d'API (dont Auth.js), les fichiers internes de Next et
  // les fichiers statiques du dossier public (images, etc.) pour ne pas les
  // soumettre à la redirection d'authentification.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
