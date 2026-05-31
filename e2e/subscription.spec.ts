import { test, expect } from "@playwright/test";

import { registerNewUser } from "./helpers";

test("s'abonner à un thème : le bouton passe à « Déjà abonné »", async ({
  page,
}) => {
  await registerNewUser(page);

  await page.goto("/themes");

  // Première carte de thème non encore suivie.
  const subscribeButton = page
    .getByRole("button", { name: "S'abonner" })
    .first();
  await expect(subscribeButton).toBeVisible();
  await subscribeButton.click();

  // Après abonnement, un bouton « Déjà abonné » (désactivé) apparaît.
  await expect(
    page.getByRole("button", { name: "Déjà abonné" }).first(),
  ).toBeVisible();
});
