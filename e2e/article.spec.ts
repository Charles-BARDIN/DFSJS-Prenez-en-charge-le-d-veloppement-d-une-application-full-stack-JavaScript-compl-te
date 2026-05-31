import { test, expect } from "@playwright/test";

import { registerNewUser } from "./helpers";

test("créer un article puis le consulter", async ({ page }) => {
  await registerNewUser(page);

  // Création de l'article.
  const title = `Article e2e ${Date.now()}`;
  await page.goto("/articles/new");

  // Sélection du thème au clavier : sous Chromium headless, le clic pointeur
  // sur une option du Select Radix ne valide pas le choix ; l'ouvrir au clavier
  // (focus + Entrée) puis naviguer (ArrowDown + Entrée) est fiable.
  const themeSelect = page.getByRole("combobox");
  await themeSelect.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("option").first()).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  // Un thème est sélectionné : le déclencheur n'affiche plus le placeholder.
  await expect(themeSelect).not.toHaveText("Sélectionner un thème");

  await page.getByLabel("Titre de l'article").fill(title);
  await page.getByLabel("Contenu de l'article").fill("Contenu de test e2e.");
  await page.getByRole("button", { name: "Créer" }).click();

  // Redirection vers la page de détail de l'article créé.
  await expect(page).toHaveURL(/\/articles\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);

  // Ajout d'un commentaire sur cet article.
  await page
    .getByPlaceholder("Écrivez ici votre commentaire")
    .fill("Super article !");
  await page.getByRole("button", { name: "Envoyer le commentaire" }).click();
  await expect(page.getByText("Super article !")).toBeVisible();
});
