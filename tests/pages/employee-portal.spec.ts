import { test, expect } from "../../fixtures/page-objects.fixture.js";

test.describe("Employee/Caregiver Operational Portal Page Spec", () => {
  test("[Test_01] should render the welcome banner dynamically with personal profile credentials", async ({ employeePortalPage }) => {
    // Assert dynamic profile welcome banner
    await expect(employeePortalPage.welcomeBanner).toBeVisible();
  });

  test("[Test_02] should handle shift clock-in/out and completion triggers with button-locking state controls", async ({ page, employeePortalPage }) => {
    // Intercept API clock actions and monitor requests
    await page.route("**/api/admin/clock-action", async (route) => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    const clockInResponsePromise = page.waitForResponse("**/api/admin/clock-action");

    // 1. Select the first available shift from the list
    await employeePortalPage.selectFirstShift();

    // 2. Click 'Clock In' and assert button is locked/disabled and API is dispatched
    await expect(employeePortalPage.clockInButton).toBeVisible();
    await employeePortalPage.clockIn();

    // Wait for endpoint handshake
    const clockInResponse = await clockInResponsePromise;
    expect(clockInResponse.status()).toBe(200);

    // Verify clock in button is now disabled to prevent spamming
    await expect(employeePortalPage.clockInButton).toBeDisabled();

    // 3. Click 'Clock Out' and assert button is disabled and API dispatched
    const clockOutResponsePromise = page.waitForResponse("**/api/admin/clock-action");
    await expect(employeePortalPage.clockOutButton).toBeVisible();
    await employeePortalPage.clockOut();

    const clockOutResponse = await clockOutResponsePromise;
    expect(clockOutResponse.status()).toBe(200);
    await expect(employeePortalPage.clockOutButton).toBeDisabled();

    // 4. Click 'Complete' and assert shift status updates
    const completeResponsePromise = page.waitForResponse("**/api/admin/clock-action");
    await expect(employeePortalPage.completeButton).toBeVisible();
    await employeePortalPage.completeShift();

    const completeResponse = await completeResponsePromise;
    expect(completeResponse.status()).toBe(200);
    await expect(employeePortalPage.completeButton).toBeDisabled();
  });

  test.skip("[Test_03] should prompt an Inactivity Security Alert warning at the idle threshold boundary and support resets", async ({ page, employeePortalPage }) => {
    // Install the Playwright Clock to mock timers
    await page.clock.install();

    // Fast-forward time programmatically by 9 minutes and 5 seconds (545,000 ms)
    await page.clock.fastForward(9 * 60 * 1000 + 5000);

    // Assert secure inactivity warning modal is prompt
    await expect(employeePortalPage.inactivityAlertTitle).toBeVisible();

    // Clicking 'Stay Logged In' must dismiss warning and reset activity trackers
    await employeePortalPage.stayLoggedIn();
    await expect(employeePortalPage.inactivityAlertTitle).not.toBeVisible();
  });

  test.skip("[Test_04] should force automated logout and purge session state if the countdown warning is fully ignored", async ({ page, employeePortalPage }) => {
    await page.clock.install();

    // Fast-forward past the 9-minute warning boundary and the full 60-second warning countdown (10 minutes total)
    await page.clock.fastForward(10 * 60 * 1000 + 2000);

    // Assert session purges automatically and forces redirect back to the entry login screen
    await expect(page).toHaveURL(/\/login/);
    await expect(employeePortalPage.sessionTimeoutMessage).toBeVisible();

    // Verify cookies and sessions are completely deleted
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === "CC_SESSION");
    expect(sessionCookie).toBeUndefined();
  });
});
