import { test, expect } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";
import path from "path";
import { routes } from "@/app/constants";
import { verifyToast, goToSettings, signUp, createTweet, createComment } from "@/e2e/e2e-utils";

// Helper to resolve test image files placed under the e2e/test-images/ directory
const testImageFile = (filename: string) =>
  path.join(process.cwd(), "e2e", "test-images", filename);

/**
 * URL Checking Flow Explanation:
 *
 * Our avatar testing strategy follows this pattern:
 * 1. Capture OLD URL before any action
 * 2. Perform the action (upload, delete)
 * 3. Capture NEW URL after the action
 * 4. Verify the URL actually CHANGED (old !== new)
 * 5. Verify the new URL matches expected PATTERN (uploaded vs default)
 * 6. Verify CONSISTENCY across all avatar locations (settings, navbar, profile, tweets)
 *
 * This ensures we're testing real state changes, not just final states.
 */

/**
 * Helper to extract the raw avatar URL from a DOM element
 *
 * @param avatarElement - The avatar image element to get URL from
 * @returns The complete URL string from the src attribute
 *
 * Usage: Used to capture URLs before/after actions to verify they changed
 */
async function getAvatarUrlFromElement(avatarElement: Locator): Promise<string> {
  await expect(avatarElement).toBeVisible();
  const src = await avatarElement.getAttribute("src");
  if (!src) {
    throw new Error("Avatar element missing src attribute");
  }
  return src;
}

/**
 * Helper to verify avatar URL matches expected pattern and return the URL
 *
 * @param avatarElement - The avatar image element to check
 * @param shouldBeUploaded - true = expect uploaded pattern (/avatars/), false = expect default pattern
 * @param description - Description for test output (e.g., "Settings avatar after upload")
 * @returns The actual URL that was verified
 *
 * Pattern Logic:
 * - Uploaded avatars: URL contains "/avatars/" (from Supabase storage)
 * - Default avatars: URL contains "/generic-profile-avatar.svg" (fallback image)
 *
 * Usage: Verify URL matches expected state AND capture the URL for further comparison
 */
async function verifyAvatarHasBeenUploaded(
  avatarElement: Locator,
  shouldBeUploaded: boolean,
  description: string
): Promise<string> {
  const actualSrc = await getAvatarUrlFromElement(avatarElement);

  if (shouldBeUploaded) {
    expect(actualSrc, `${description} should contain /avatars/ (uploaded)`).toContain("/avatars/");
  } else {
    expect(
      actualSrc,
      `${description} should contain generic-profile-avatar.svg (default)`
    ).toContain("/generic-profile-avatar.svg");
  }

  return actualSrc;
}
// Helper to check tweet and comment avatars after upload/deletion
async function checkTweetAndCommentAvatars(
  page: Page,
  tweetText: string,
  commentText: string,
  shouldBeUploaded: boolean
): Promise<void> {
  const tweetCard = page
    .getByTestId("tweets-wrapper")
    .getByTestId("tweet-container")
    .filter({ hasText: tweetText })
    .first();
  await expect(tweetCard).toBeVisible();

  // Verify tweet author avatar
  const tweetAvatarElement = tweetCard.getByTestId("tweet-author-avatar").first();
  await verifyAvatarHasBeenUploaded(tweetAvatarElement, shouldBeUploaded, "Tweet author avatar");

  const commentRow = tweetCard
    .getByTestId("comment-container")
    .filter({ hasText: commentText })
    .first();
  await expect(commentRow).toBeVisible();

  // Verify comment author avatar
  const commentAvatarElement = commentRow.getByTestId("comment-author-avatar").first();
  await verifyAvatarHasBeenUploaded(
    commentAvatarElement,
    shouldBeUploaded,
    "Comment author avatar"
  );
}

// Derive the current user's profile URL from the navbar avatar link to avoid hardcoding user IDs
export async function getNavbarProfileUrl(page: Page): Promise<string> {
  // The avatar image is wrapped by an anchor link to the profile page
  const navbarProfileLink = page.locator("a", { has: page.getByTestId("navbar-avatar") }).first();
  await expect(navbarProfileLink).toBeVisible();

  const href = await navbarProfileLink.getAttribute("href");
  if (!href) {
    throw new Error("Navbar profile link missing href attribute");
  }
  return href;
}

test("Avatar Upload", async ({ page }) => {
  // Set timeout to 70 seconds to avoid tests failing because of duration of the test
  test.setTimeout(70000);
  // Variables to track test data created during the test
  let tweetText: string;
  let commentText: string;
  let currentAvatarUrl: string;

  await test.step("uploads avatar successfully for PNG/JPG/WebP and persists after reload", async () => {
    // Sign up
    await signUp(page);

    // Go to settings
    await goToSettings(page);

    // Confirm the avatar image is visible and initially the default avatar
    const avatarImg = page.getByTestId("settings-avatar");
    await verifyAvatarHasBeenUploaded(avatarImg, false, "Settings avatar initially");

    const files = [
      "png-format-test-avatar.png",
      "jpeg-format-test-avatar.jpg",
      "webp-format-test-avatar.webp",
    ];

    for (const file of files) {
      // Get the current URL before upload
      const oldUrl = await getAvatarUrlFromElement(avatarImg);

      // Upload
      await page.setInputFiles("#avatar-upload", testImageFile(file));
      // Upload the file
      await page.getByRole("button", { name: "Upload" }).click();
      await verifyToast(page, "Avatar updated successfully");

      // Get the new URL after upload and verify it changed
      const newUrl = await verifyAvatarHasBeenUploaded(
        avatarImg,
        true,
        `Settings avatar after uploading ${file}`
      );

      // Ensure the URL actually changed
      expect(newUrl, `Avatar URL should change after uploading ${file}`).not.toBe(oldUrl);

      // Update current avatar URL for later tests
      currentAvatarUrl = newUrl;
    }

    // Reload and ensure persistence
    await page.reload();
    await page.waitForURL(routes.protectedRoutes.settings);
    const afterReloadAvatarImg = page.getByTestId("settings-avatar");
    const persistedUrl = await verifyAvatarHasBeenUploaded(
      afterReloadAvatarImg,
      true,
      "Settings avatar after reload"
    );

    // Verify the URL persisted correctly
    expect(persistedUrl, "Avatar URL should persist after reload").toBe(currentAvatarUrl);
  });

  await test.step("tests image editing flow", async () => {
    // Get current URL before editing
    const settingsAvatar = page.getByTestId("settings-avatar");
    const oldUrl = await getAvatarUrlFromElement(settingsAvatar);

    // Upload a fresh image to edit
    await page.setInputFiles("#avatar-upload", testImageFile("png-format-test-avatar.png"));

    // Edit button should appear after selecting file
    const editButton = page.getByRole("button", { name: "Edit Avatar" });
    await expect(editButton).toBeVisible();

    // Click edit to open image editor dialog
    await editButton.click();

    // Verify image editor dialog opens
    const imageEditorDialog = page.getByRole("dialog");
    await expect(imageEditorDialog).toBeVisible();
    await expect(page.getByRole("heading", { name: "Edit Avatar" })).toBeVisible();

    // Test edit controls buttons are visible
    const zoomSlider = page.getByTestId("zoom-slider");
    const rotateLeftButton = page.getByTestId("rotate-left-button");
    const rotateRightButton = page.getByTestId("rotate-right-button");
    const flipHorizontalButton = page.getByTestId("flip-horizontal-button");
    const flipVerticalButton = page.getByTestId("flip-vertical-button");
    await expect(zoomSlider).toBeVisible();
    await expect(rotateLeftButton).toBeVisible();
    await expect(rotateRightButton).toBeVisible();
    await expect(flipHorizontalButton).toBeVisible();
    await expect(flipVerticalButton).toBeVisible();

    // Test reset button is visible
    const resetButton = page.getByRole("button", { name: "Reset" });
    await expect(resetButton).toBeVisible();

    // Save changes
    const saveChangesButton = page.getByRole("button", { name: "Save Changes" });
    await expect(saveChangesButton).toBeVisible();
    await saveChangesButton.click();

    // Wait for success toast to confirm save completed
    await verifyToast(page, "Image edited successfully");

    // Verify dialog closes after successful save
    await expect(imageEditorDialog).not.toBeVisible();

    // Upload button should be enabled after editing
    const uploadButton = page.getByRole("button", { name: "Upload" });
    await expect(uploadButton).toBeEnabled();

    // Upload the edited image
    await uploadButton.click();
    await verifyToast(page, "Avatar updated successfully");

    // Get the new URL after editing and verify it changed
    const newUrl = await verifyAvatarHasBeenUploaded(
      settingsAvatar,
      true,
      "Settings avatar after editing"
    );

    // Ensure the URL actually changed
    expect(newUrl, "Avatar URL should change after editing and uploading").not.toBe(oldUrl);

    // Update current avatar URL for later tests
    currentAvatarUrl = newUrl;
  });

  await test.step("shows avatar in navbar and navigates to profile page", async () => {
    // Verify the uploaded avatar is visible in the navbar
    const navbarAvatar = page.getByTestId("navbar-avatar");
    const navbarUrl = await verifyAvatarHasBeenUploaded(navbarAvatar, true, "Navbar avatar");

    // Verify navbar shows the same URL as settings
    expect(navbarUrl, "Navbar avatar should match settings avatar").toBe(currentAvatarUrl);

    // Navigate to profile via navbar avatar link
    const expectedProfileUrl = await getNavbarProfileUrl(page);
    await navbarAvatar.click();
    // Verify we're on the correct profile page URL (derived dynamically)
    await page.getByRole("heading", { name: "Profile" }).waitFor({ state: "visible" });
    await expect(page).toHaveURL(expectedProfileUrl);

    // Confirm avatar shows on profile page as uploaded
    const profileAvatar = page.getByTestId("profile-avatar").first();
    const profileUrl = await verifyAvatarHasBeenUploaded(
      profileAvatar,
      true,
      "Profile page avatar"
    );

    // Verify profile shows the same URL as settings
    expect(profileUrl, "Profile avatar should match settings avatar").toBe(currentAvatarUrl);
  });

  await test.step("verify avatar appears on created tweet and comment", async () => {
    // Go to timeline
    await page.goto(routes.protectedRoutes.timeline);

    // Create a test tweet with the newly signed up user
    tweetText = `Test tweet to check avatar upload works - ${new Date().toISOString()}`;
    await createTweet(page, tweetText);

    // Create a test comment on the tweet
    commentText = `Test comment to check avatar upload works - ${new Date().toISOString()}`;
    await createComment(page, tweetText, commentText);

    // Check both tweet and comment avatars show uploaded avatar (not default)
    await checkTweetAndCommentAvatars(page, tweetText, commentText, true);
  });

  await test.step("shows validation error for invalid mime type", async () => {
    // Go to settings
    await goToSettings(page);

    // Upload an invalid file format
    await page.setInputFiles("#avatar-upload", testImageFile("invalid-format-test-avatar.pdf"));
    // File is rejected client-side; Upload stays disabled
    await expect(page.getByRole("button", { name: "Upload" })).toBeDisabled();
    await verifyToast(page, "Only JPEG, PNG and WebP image formats are allowed");
  });

  await test.step("shows validation error for file larger than 1MB", async () => {
    // Ensure we're on settings page for file upload
    await goToSettings(page);
    await page.setInputFiles("#avatar-upload", testImageFile("large-size-test-avatar.png"));
    // File is rejected client-side; Upload stays disabled
    await expect(page.getByRole("button", { name: "Upload" })).toBeDisabled();
    await verifyToast(page, "File size must be less than 1MB");
  });

  await test.step("deletes uploaded avatar and returns to default", async () => {
    // Ensure we're on settings page for deletion
    await goToSettings(page);

    // Upload a valid image first
    await page.setInputFiles("#avatar-upload", testImageFile("png-format-test-avatar.png"));
    await page.getByRole("button", { name: "Upload" }).click();
    await verifyToast(page, "Avatar updated successfully");

    const settingsAvatarImg = page.getByTestId("settings-avatar");

    // Verify we have an uploaded avatar before deletion
    const uploadedUrl = await verifyAvatarHasBeenUploaded(
      settingsAvatarImg,
      true,
      "Settings avatar before deletion"
    );

    // Click the delete button that appears over the avatar
    await page.getByTestId("delete-avatar-button").click();
    await verifyToast(page, "Avatar removed successfully");

    // Verify avatar reverted to default and URL changed
    const defaultUrl = await verifyAvatarHasBeenUploaded(
      settingsAvatarImg,
      false,
      "Settings avatar after deletion"
    );

    // Ensure the URL actually changed from uploaded to default
    expect(defaultUrl, "Avatar URL should change from uploaded to default after deletion").not.toBe(
      uploadedUrl
    );

    // Navbar avatar should also revert to default
    const navbarAfterDelete = page.getByTestId("navbar-avatar");
    await verifyAvatarHasBeenUploaded(navbarAfterDelete, false, "Navbar avatar after deletion");

    // Verify timeline tweet and comment avatars revert to default
    await page.goto(routes.protectedRoutes.timeline);
    await checkTweetAndCommentAvatars(page, tweetText, commentText, false);

    // Verify profile page avatar reverts to default as well
    const navbarAvatar = page.getByTestId("navbar-avatar");
    await expect(navbarAvatar).toBeVisible();
    await navbarAvatar.click();

    // Verify we're on the correct profile page URL (derived dynamically)
    const expectedProfileUrlAfterDelete = await getNavbarProfileUrl(page);
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page).toHaveURL(expectedProfileUrlAfterDelete);

    const profileAvatar = page.getByTestId("profile-avatar").first();
    await verifyAvatarHasBeenUploaded(profileAvatar, false, "Profile avatar after deletion");
  });
});
