import { test, expect } from "@playwright/test";
import {
  verifyToast,
  waitForTweetsContainer,
  getTweetContainer,
  createTweet,
  createComment,
} from "./e2e-utils";
import { Page } from "@playwright/test";
import { routes } from "@/app/constants";

test("Timeline", async ({ page }) => {
  // Navigate to timeline - since we only have one timeline now, we just need to be on the logged-in page
  await page.goto(routes.protectedRoutes.timeline);

  await test.step("should create a new tweet successfully", async () => {
    const tweetText = `This is a test tweet ${new Date().toISOString()}`;
    await createTweet(page, tweetText);

    // Verify the tweet is displayed on screen
    // Use exact match to ensure we find the exact tweet text, not a substring or similar tweet
    const createdTweet = page.getByText(tweetText, { exact: true });
    await expect(createdTweet).toBeVisible();

    // Verify tweet input is cleared after posting
    const tweetInput = page.getByPlaceholder("What's happening?");
    await expect(tweetInput).toBeEmpty();
  });

  await test.step("should disable tweet button when character limit is reached", async () => {
    // Wait for the tweets container to be ready (indicating page is fully loaded)
    await waitForTweetsContainer(page);

    const tweetInput = page.getByPlaceholder("What's happening?");
    const tweetButton = page.getByRole("button", { name: "Tweet" });

    // Initially the button should be disabled (empty input)
    await expect(tweetButton).toBeDisabled();

    // Type some valid text
    await tweetInput.fill("Hello world");
    await expect(tweetButton).toBeEnabled();

    // Type exactly 280 'A' characters
    await tweetInput.fill("A".repeat(280));

    // Verify the button is disabled when limit is reached
    await expect(tweetButton).toBeDisabled();

    // Try to type one more character (should still be disabled)
    await tweetInput.pressSequentially("A");
    await expect(tweetButton).toBeDisabled();
  });

  await test.step("should delete a tweet successfully", async () => {
    // Create a test tweet
    const tweetText = await createTweet(page, `Tweet to be deleted ${new Date().toISOString()}`);

    // Delete the tweet using utility function
    await deleteTweet(page, tweetText);
  });

  await test.step("should create a comment on a tweet successfully", async () => {
    // Create a test tweet first
    const tweetText = `Tweet for commenting ${new Date().toISOString()}`;
    await createTweet(page, tweetText);

    // Create a comment on the tweet
    const commentText = `This is a test comment ${new Date().toISOString()}`;
    await createComment(page, tweetText, commentText);

    // Verify the comment is displayed
    const createdComment = page.getByText(commentText, { exact: true });
    await expect(createdComment).toBeVisible();

    // Verify the comment dialog is closed after posting
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  await test.step("should delete a comment successfully", async () => {
    // Create a test tweet
    const tweetText = `Tweet for comment deletion ${new Date().toISOString()}`;
    await createTweet(page, tweetText);

    // Create a comment on the tweet
    const commentText = `Comment to be deleted ${new Date().toISOString()}`;
    await createComment(page, tweetText, commentText);

    // Delete the comment
    await deleteComment(page, tweetText, commentText);

    // Verify the comment is no longer visible
    const deletedComment = page.getByText(commentText, { exact: true });
    await expect(deletedComment).not.toBeVisible();
  });
});

// Local utility functions for timeline-specific operations
async function deleteTweet(page: Page, tweetText: string) {
  const tweetContainer = getTweetContainer(page, tweetText);
  const deleteButton = tweetContainer.getByTestId("delete-tweet-button");
  await deleteButton.click();

  // Verify that the tweet is no longer visible
  await expect(tweetContainer).not.toBeVisible();

  // Verify the success toast appears
  await verifyToast(page, "Tweet deleted successfully");
}

async function deleteComment(page: Page, tweetText: string, commentText: string) {
  const tweetContainer = getTweetContainer(page, tweetText);

  // Find the comment container and delete button
  const createdComment = page.getByTestId("comment-container").filter({ hasText: commentText });
  const deleteButton = createdComment.getByTestId("delete-comment-button");
  await deleteButton.click();

  // Verify the comment was deleted
  await expect(createdComment).not.toBeVisible();
  await expect(tweetContainer.getByTestId("comment-count")).toHaveText("0 comments");

  // Verify the success toast appears
  await verifyToast(page, "Comment deleted successfully");
}
