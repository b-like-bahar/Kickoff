import { routes } from "@/app/constants";
import { test, expect } from "@playwright/test";
import { verifyToast } from "@/e2e/e2e-utils";

test("Route Protection should redirect to home if user is not logged in", async ({ page }) => {
  const protectedUrls = Object.values(routes.protectedRoutes).map(u => u.replace(/\[.+?\]/g, "1"));
  for (const url of protectedUrls) {
    // Navigate to the logged in routes
    await page.goto(url);

    // Verify the user is redirected to the home page (logged out page)
    await expect(page).toHaveURL(routes.publicRoutes.home);

    // Verify the warning toast and dismiss it
    await verifyToast(page, "You must be logged in to access this page");
  }
});
