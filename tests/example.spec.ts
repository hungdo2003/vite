import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


// const fileChooserPromise1 = page.waitForEvent('filechooser');
// await page.getByRole('button', { name: 'Jpg, Png, Pdf up to 64MB in' }).first().click();
// const fileChooser1 = await fileChooserPromise1;
// await fileChooser1.setFiles(path.join(__dirname, file));