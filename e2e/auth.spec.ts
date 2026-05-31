import { test, expect } from "@playwright/test";

import { registerNewUser, uniqueUser } from "./helpers";

test("inscription : nouvel utilisateur connecté et redirigé vers le fil", async ({
  page,
}) => {
  await registerNewUser(page);
  await expect(page).toHaveURL(/\/feed/);
  // Le fil n'est accessible que connecté : on y est bien.
  await expect(
    page.getByRole("link", { name: "Créer un article" }),
  ).toBeVisible();
});

test("connexion puis déconnexion d'un compte existant", async ({ page }) => {
  // On crée d'abord un compte, puis on se déconnecte pour tester la connexion.
  const user = await registerNewUser(page);
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await expect(page).toHaveURL("/");

  // Connexion par nom d'utilisateur.
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill(user.username);
  await page.getByLabel("Mot de passe").fill(user.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/feed/);
});

test("connexion refusée avec un mauvais mot de passe", async ({ page }) => {
  const user = uniqueUser();
  await page.goto("/login");
  await page.getByLabel("E-mail ou nom d'utilisateur").fill(user.username);
  await page.getByLabel("Mot de passe").fill("MauvaisMdp#1");
  await page.getByRole("button", { name: "Se connecter" }).click();
  // On reste sur la page de connexion avec un message d'erreur.
  await expect(page.getByRole("alert")).toBeVisible();
});

test("une route protégée redirige un visiteur non connecté vers /login", async ({
  page,
}) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login/);
});
