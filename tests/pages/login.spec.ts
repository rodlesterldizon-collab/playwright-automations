import { test, expect } from "@playwright/test";
import { LoginPage } from "../pom/LoginPage.js";
import { getAuthData } from "../helpers.js";

test.describe("Staff Identity & Access Management Spec", () => {
  let loginPage: LoginPage;
  const authData = getAuthData();

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page, request);
    await page.goto("/login");
  });

  test("[Test_01] should display the core login forms and visual credentials input", async () => {
    await expect(loginPage.pageTitle).toBeVisible();
    await expect(loginPage.sectionHeading).toBeVisible();
    await expect(loginPage.sectionSubheading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.contactItSupportLink).toBeVisible();
  });

  test("[Test_02] should display the modal when forgot password is pressed", async ({ page }) => {
    // Register dialog handler before trigger
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain(
        "In a production setup, a reset link is dispatched to your registered @compassioncare.com inbox."
      );
      await dialog.accept();
    });

    await loginPage.forgotPasswordLink.click();
  });

  test.skip("[Test_03] should trigger contact IT support slide-down form and dispatch an access request", async ({ page }) => {
    await page.route("**/api/auth/request-access", async (route) => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    const apiResponsePromise = page.waitForResponse("**/api/auth/request-access");

    // Click link to slide down form
    await loginPage.contactItSupportLink.click();

    // Fill the intake form input fields
    await loginPage.supportEmailInput.fill(authData.requestAccessUser.email);

    // Submit IT request (the second button inside the form / page usually)
    await loginPage.itSupportSubmitButton.click();

    // Assert API response
    const apiResponse = await apiResponsePromise;
    expect(apiResponse.status()).toBe(200);

    // Verify success indicator
    await expect(loginPage.requestSubmittedMessage).toBeVisible();
  });

  test.skip("[Test_04] should handle SSO Google Multi-Environment Authentication", async ({ page }) => {
    // Setup popup listener or window open evaluation
    const popupPromise = page.waitForEvent("popup");
    await loginPage.googleSsoButton.click();
    const popup = await popupPromise;
    expect(popup.url()).toMatch(/firebaseapp\.com\/__\/auth\/handler/);
  });
});
