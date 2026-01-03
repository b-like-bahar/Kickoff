import { defineConfig, devices } from "@playwright/test";

// Patterns for unauthenticated tests that handle their own authentication
// These tests do not use the pre-authenticated user state and are run separately
const unauthenticatedTestPatterns = [
  "**/delete-account.spec.ts",
  "**/sign-up.spec.ts",
  "**/route-protection-logged-out.spec.ts",
  "**/avatar-upload.spec.ts",
];

export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
  },

  /* Configure projects for different test scenarios */
  projects: [
    // Authentication setup - creates a signed-in user state for other tests
    {
      name: "auth-setup",
      testMatch: /.*\.setup\.ts/,
    },
    // Public/unauthenticated tests - these handle their own authentication flow
    {
      name: "unauthenticated",
      use: {
        ...devices["Desktop Chrome"],
        // No storage state - these tests handle their own authentication
      },
      testMatch: unauthenticatedTestPatterns,
    },
    // Authenticated tests - use pre-authenticated user state
    {
      name: "authenticated",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./.auth/user.json",
      },
      dependencies: ["auth-setup"],
      testIgnore: [...unauthenticatedTestPatterns, "**/*.setup.ts"],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
