import { test, expect } from "@playwright/test";
import { signUp, verifyToast } from "@/e2e/e2e-utils";

test("Sign up", async ({ page }) => {
  await test.step("setup sign up page", async () => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get Started" }).click();
    await page.getByRole("tab", { name: "Sign up" }).click();
  });

  await test.step("should show email validation error for invalid email", async () => {
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByPlaceholder("Password", { exact: true }).fill("ValidPass123!");
    await page.getByPlaceholder("Confirm Password").fill("ValidPass123!");
    await page.getByRole("button", { name: "Create Account" }).click();
    // Verify the error message appears
    await expect(page.getByText("Invalid email")).toBeVisible();
  });

  await test.step("should show password match error for not matching passwords", async () => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByPlaceholder("Password", { exact: true }).fill("Password123!");
    await page.getByPlaceholder("Confirm Password").fill("different");
    await page.getByRole("button", { name: "Create Account" }).click();
    // Verify the error message appears
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  await test.step("should show password validation error for invalid password", async () => {
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByPlaceholder("Password", { exact: true }).fill("weak");
    await page.getByPlaceholder("Confirm Password").fill("weak");
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page.getByText("Password must be at least 8 characters long")).toBeVisible();
  });

  await test.step("should handle duplicate email", async () => {
    await page.getByLabel("Email").fill("alex@example.com");
    await page.getByPlaceholder("Password", { exact: true }).fill("Password123!");
    await page.getByPlaceholder("Confirm Password", { exact: true }).fill("Password123!");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Verify the error toast appears and dismiss it
    await verifyToast(page, "User already registered");
  });

  await test.step("should successfully sign up a new user", async () => {
    await signUp(page);
  });
});
