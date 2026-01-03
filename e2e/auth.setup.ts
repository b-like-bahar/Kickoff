import { test as setup } from "@playwright/test";
import path from "path";
import { verifyToast } from "@/e2e/e2e-utils";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Get Started" }).click();
  await page.getByRole("tab", { name: "Sign in" }).click();

  // Use e2e@example.com as the shared test account
  await page.getByLabel("Email").fill("e2e@example.com");
  await page.getByRole("textbox", { name: "Password" }).fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();

  // Verify and dismiss the success toast
  await verifyToast(page, "Signed in successfully");

  // Verify redirect to timeline page after successful login
  await page.getByRole("heading", { name: "Timeline" }).waitFor({ state: "visible" });

  // Verify successful authentication and save storage state
  await page.context().storageState({ path: authFile });
});
