import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["html"], ["github"]] : "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm run preview",
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001, // Allow 0.1% pixel difference for minor rendering variations
    },
  },
});
