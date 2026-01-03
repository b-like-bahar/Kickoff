import { routes } from "@/app/constants";
import { test, expect } from "@playwright/test";
import { verifyToast } from "@/e2e/e2e-utils";

test("URL Parameter Cleanup", async ({ page }) => {
  await test.step("setup timeline page", async () => {
    await page.goto(routes.protectedRoutes.timeline);
  });

  await test.step("should display toast and clean up only message/messageType while preserving other parameters", async () => {
    // Navigate with multiple URL parameters including message and messageType
    const testUrl = `${routes.protectedRoutes.timeline}?message=Test%20message&messageType=success&tab=home`;
    await page.goto(testUrl);

    // Verify the success toast appears
    await verifyToast(page, "Test message");

    // Verify that only message and messageType parameters were removed
    await expect(page).toHaveURL(`${routes.protectedRoutes.timeline}?tab=home`);
  });

  await test.step("should clean up parameters when no other parameters exist", async () => {
    // Navigate with only message parameters
    const testUrl = `${routes.protectedRoutes.timeline}?message=Standalone%20message&messageType=error`;
    await page.goto(testUrl);

    // Verify the error toast appears
    await verifyToast(page, "Standalone message");

    // Verify that the URL has no query parameters left
    await expect(page).toHaveURL(routes.protectedRoutes.timeline);
  });

  await test.step("should not display toast when no message parameter exists", async () => {
    // Navigate with other parameters but no message
    const testUrl = `${routes.protectedRoutes.timeline}?tab=home`;
    await page.goto(testUrl);

    // Wait for page to load
    await page
      .getByRole("heading", { name: "Timeline", exact: true })
      .waitFor({ state: "visible" });

    // Verify no toast appears
    await expect(page.locator("[data-sonner-toast]")).not.toBeVisible();

    // Verify that other parameters remain unchanged
    await expect(page).toHaveURL(`${routes.protectedRoutes.timeline}?tab=home`);
  });
});
