import { expect, type Page } from "@playwright/test";

// Génère des identifiants uniques pour éviter les collisions entre tests
// (la base de test n'est réinitialisée qu'une fois au démarrage du serveur).
export const uniqueUser = () => {
  const suffix = Math.random().toString(36).slice(2, 8);
  return {
    username: `user_${suffix}`,
    email: `user_${suffix}@mdd.test`,
    password: "Secret#123",
  };
};

/** Inscrit un nouvel utilisateur via l'interface ; l'amène connecté sur le fil
 * (page d'accueil). */
export const registerNewUser = async (page: Page) => {
  const user = uniqueUser();
  await page.goto("/register");
  await page.getByLabel("Nom d'utilisateur").fill(user.username);
  await page.getByLabel("Adresse e-mail").fill(user.email);
  await page.getByLabel("Mot de passe").fill(user.password);
  await page.getByRole("button", { name: "S'inscrire" }).click();
  // Une fois inscrit, l'utilisateur est connecté et renvoyé sur l'accueil (le fil).
  await expect(page).toHaveURL("/");
  return user;
};
