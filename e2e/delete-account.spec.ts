import { routes } from "@/app/constants";
import { test, expect } from "@playwright/test";
import { signUp, verifyToast, goToSettings } from "@/e2e/e2e-utils";

test("Delete account", async ({ page }) => {
  await test.step("Delete account", async () => {
    // Sign up
    const { email, password } = await signUp(page);

    // Go to settings
    await goToSettings(page);

    // Delete account
    await page.getByRole("button", { name: "Delete Account" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();
    await verifyToast(page, "Account deleted successfully");

    // Verify we're on the home page
    await expect(page).toHaveURL(routes.publicRoutes.home);
    await expect(page.getByRole("button", { name: "Get Started" })).toBeVisible();

    // Try to login with the deleted account credentials
    await page.getByRole("button", { name: "Get Started" }).click();
    await page.getByRole("tab", { name: "Sign in" }).click();

    //Login
    await page.getByLabel("Email").fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    // Verify and dismiss the error toast
    await verifyToast(page, "Invalid login credentials");
  });
});
