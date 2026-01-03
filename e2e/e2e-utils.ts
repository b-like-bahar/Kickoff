import { routes } from "@/app/constants";
import { expect, Page } from "@playwright/test";

export async function verifyToast(page: Page, text: string) {
  const locatorName = "[data-sonner-toast]";
  await page.waitForSelector(locatorName, { state: "visible" });
  const toast = page.getByText(text);
  await expect(toast).toBeVisible();

  const dialog = page.getByRole("dialog");
  // If there's a dialog open, close it first otherwise the toast will not be targeted
  if (dialog) {
    if (await dialog.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  }

  // Dismiss the toast after verification
  const dismissButton = page.locator(locatorName).first().getByRole("button", { name: "Dismiss" });
  // Wait for button to be stable before clicking
  await dismissButton.waitFor({ state: "visible" });
  await dismissButton.click();

  // Wait for the toast to disappear
  await expect(toast).not.toBeVisible();
}

export async function signUp(page: Page) {
  const email = `test-${Date.now()}@example.com`;
  const password = "Password123!";

  await page.goto(routes.publicRoutes.home);
  await page.getByRole("button", { name: "Get Started" }).click();
  await page.getByRole("tab", { name: "Sign up" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByPlaceholder("Confirm Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();

  await verifyToast(page, "Account created successfully");

  // Wait for URL to contain the confirmation page path
  await expect(page).toHaveURL(url => url.pathname.includes(routes.publicRoutes.confirmationPage));
  await expect(page.getByTestId("confirmation-page")).toBeVisible();

  return { email, password };
}

export async function goToSettings(page: Page) {
  await page.goto(routes.protectedRoutes.settings);
  await page.waitForURL(routes.protectedRoutes.settings);
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
}

export async function waitForTweetsContainer(page: Page) {
  // Wait for the main tweets container to be visible
  const tweetsContainer = page.getByTestId("tweets-wrapper");
  await expect(tweetsContainer).toBeVisible();
}

export function getTweetContainer(page: Page, tweetText: string) {
  return page.getByTestId("tweet-container").filter({ hasText: tweetText });
}

export async function createTweet(page: Page, tweetText: string) {
  // Wait for the tweets container to be ready (indicating page is fully loaded)
  await waitForTweetsContainer(page);

  const tweetInput = page.getByPlaceholder("What's happening?");
  await expect(tweetInput).toBeVisible();
  await expect(tweetInput).toBeEnabled();
  await tweetInput.click(); // Focus the input first
  await tweetInput.fill(tweetText);
  await page.getByRole("button", { name: "Tweet" }).click();

  const createdTweet = page.getByText(tweetText, { exact: true });
  await expect(createdTweet).toBeVisible();

  // Verify and dismiss the success toast
  await verifyToast(page, "Tweet created successfully");

  return tweetText;
}

export async function createComment(page: Page, tweetText: string, commentText: string) {
  // Find the tweet container and comment button
  const tweetContainer = getTweetContainer(page, tweetText);
  const commentButton = tweetContainer.getByTestId("comment-tweet-button");

  // Click the comment button to open comment interface
  await commentButton.click();

  // Fill in the comment text and post it
  const commentInput = page.getByPlaceholder("Add a comment...");
  await expect(commentInput).toBeVisible();
  await commentInput.fill(commentText);
  await page.getByRole("button", { name: "Comment" }).click();
  await page.waitForLoadState("load");

  // Verify the comment was added
  const createdComment = page.getByText(commentText);
  await expect(createdComment).toBeVisible();

  // Verify and dismiss the success toast
  await verifyToast(page, "Comment created successfully");

  return { commentText, commentInput, tweetContainer };
}
