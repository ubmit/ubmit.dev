import { test, expect } from "@playwright/test";

const pages = [
  { name: "homepage", path: "/" },
  { name: "blog-post", path: "/agentic-engineering-without-lock-in/" },
];

for (const { name, path } of pages) {
  test(`${name} - light mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(path);
    await expect(page).toHaveScreenshot(`${name}-light.png`, {
      fullPage: true,
    });
  });

  test(`${name} - dark mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(path);
    await expect(page).toHaveScreenshot(`${name}-dark.png`, {
      fullPage: true,
    });
  });
}
