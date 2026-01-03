import { routes } from "@/app/constants";
import { test, expect } from "@playwright/test";
import { verifyToast } from "@/e2e/e2e-utils";

test("Route Protection should redirect logged in users away from home page", async ({ page }) => {
  await page.goto(routes.protectedRoutes.timeline);

  const pages = [
    // Timeline page
    {
      pageHeader: "Timeline",
      navigation: page.getByRole("link", { name: "Your logo" }),
      expectedUrl: routes.protectedRoutes.timeline,
    },
    {
      pageHeader: "Profile",
      // click on the first user in the list
      navigation: page.getByRole("link", { name: "e2e@example.com View profile" }),
      expectedUrl: "/user",
    },
    {
      pageHeader: "Settings",
      navigation: page.getByRole("link", { name: "Settings" }),
      expectedUrl: routes.protectedRoutes.settings,
    },
  ];

  for (const currentPage of pages) {
    // Navigate to the logged in pages and verify the page is loaded
    // Use exact match for link to avoid partial matches with similar navigation items
    await currentPage.navigation.click();
    await page.waitForURL(url => url.pathname.includes(currentPage.expectedUrl));
    // Use exact match for heading to ensure we're on the correct page
    await page.getByRole("heading", { name: currentPage.pageHeader }).waitFor({
      state: "visible",
    });

    // Navigate to home page (logged out page)
    await page.goto(routes.publicRoutes.home);

    // Verify the user is redirected to the timeline page
    await expect(page).toHaveURL(routes.protectedRoutes.timeline);

    // Verify the warning toast and dismiss it
    await verifyToast(page, "You must be signed out to access this page");
  }
});
