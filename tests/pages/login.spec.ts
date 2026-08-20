import { test, expect } from "../../fixtures/page-objects.fixture.js";
import { getAuthData } from "../helpers.js";

test.describe("Staff Identity & Access Management Spec", () => {
  const authData = getAuthData();

  test("[Test_01] @smoke should display the core login forms and visual credentials input", async ({ loginPage }) => {
    await expect(loginPage.pageTitle).toBeVisible();
    await expect(loginPage.sectionHeading).toBeVisible();
    await expect(loginPage.sectionSubheading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.contactItSupportLink).toBeVisible();
  });

  test("[Test_02] should display the modal when forgot password is pressed", async ({ loginPage }) => {
    const dialogMessage = await loginPage.triggerForgotPassword();
    expect(dialogMessage).toContain(
      "In a production setup, a reset link is dispatched to your registered @compassioncare.com inbox."
    );
  });

  test.skip("[Test_03] should trigger contact IT support slide-down form and dispatch an access request", async ({ page, loginPage }) => {
    await page.route("**/api/auth/request-access", async (route) => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    const apiResponsePromise = page.waitForResponse("**/api/auth/request-access");
    await loginPage.submitItSupportRequest(authData.requestAccessUser.email);

    const apiResponse = await apiResponsePromise;
    expect(apiResponse.status()).toBe(200);
    await expect(loginPage.requestSubmittedMessage).toBeVisible();
  });

  test.skip("[Test_04] should handle SSO Google Multi-Environment Authentication", async ({ page, loginPage }) => {
    const popupPromise = page.waitForEvent("popup");
    await loginPage.googleSsoButton.click();
    const popup = await popupPromise;
    expect(popup.url()).toMatch(/firebaseapp\.com\/__\/auth\/handler/);
  });
});
