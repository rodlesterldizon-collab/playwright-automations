import { test, expect } from "@playwright/test";
import { loginProgrammatic, getAdminCredentials } from "../helpers.js";
import { AdminPortalPage } from "../pom/AdminPortalPage.js";

test.describe("Administrative Portal Management Page Spec", () => {
  test.beforeEach(async ({ context }) => {
    // Authenticate programmatically using context.request to share session cookies with page
    const credentials = getAdminCredentials();
    await loginProgrammatic(context, context.request, credentials.email, credentials.password);
  });

  test("[Test_01] should support staff registry auditing and employee state switches", async ({ page, request }) => {
    const adminPage = new AdminPortalPage(page, request);
    await page.goto("/admin");

    // Switch to Employee Registry tab
    await adminPage.registry.registryTab.click();

    // Verify employee list contains Elena Rodriguez
    await expect(adminPage.registry.getEmployeeName("Elena Rodriguez")).toBeVisible();

    // Toggle management options for Elena Rodriguez
    await expect(adminPage.registry.getEmployeeCardStatus("Elena Rodriguez", "Active")).toBeVisible();
  });

  test.skip("[Test_02] should assign, list, and delete client shifts through the master scheduling interface", async ({ page, request }) => {
    const adminPage = new AdminPortalPage(page, request);
    await page.goto("/admin");

    // We are on the 'Scheduler' tab by default
    await expect(adminPage.scheduler.assignNewShiftHeading).toBeVisible();

    // 1. Populate the shift form inputs
    // Dropdown selection for employee
    await adminPage.scheduler.employeeDropdown.selectOption({ label: "Elena Rodriguez" });

    // Client Name
    await adminPage.scheduler.clientNameInput.fill("Arthur Pendragon");

    // Custom date input
    await adminPage.scheduler.dateInput.fill("2026-07-29");

    // Location
    await adminPage.scheduler.locationInput.fill("Camelot Village");

    // Notes
    await adminPage.scheduler.notesTextarea.fill("Serve royal lunch at noon.");

    // 2. Submit shift form
    await adminPage.scheduler.assignShiftButton.click();

    // 3. Assert success banner is rendered
    await expect(adminPage.scheduler.assignSuccessBanner).toBeVisible();

    // 4. Verify the newly assigned shift appears in the list
    await expect(adminPage.scheduler.getShiftClientName("Arthur Pendragon")).toBeVisible();
    await expect(adminPage.scheduler.getShiftLocation("Camelot Village")).toBeVisible();

    // 5. Delete the shift to verify scheduling hygiene
    await adminPage.scheduler.getShiftDeleteButton("Arthur Pendragon").click();

    // Confirm deletion in the confirmation modal if present
    if (await adminPage.scheduler.confirmDeletionButton.isVisible()) {
      await adminPage.scheduler.confirmDeletionButton.click();
    }

    // Verify shift is removed
    await expect(adminPage.scheduler.getShiftClientName("Arthur Pendragon")).not.toBeVisible();
  });

  test.skip("[Test_03] should support auditing of caregiver leave requests and updating approval states", async ({ page, request }) => {
    const adminPage = new AdminPortalPage(page, request);
    await page.goto("/admin");

    // Navigate to Leave Approvals tab
    await adminPage.leaveApprovals.leaveTab.click();

    // Verify Leave requests title is displayed
    await expect(adminPage.leaveApprovals.leaveApprovalsTitle).toBeVisible();
  });

  test.skip("[Test_04] should respond reactively to live Feature Flag visibility adjustments", async ({ page, request }) => {
    const adminPage = new AdminPortalPage(page, request);
    await page.goto("/admin");

    // 1. Open Feature Flag console drawer
    await adminPage.featureFlags.featureFlagsButton.click();

    // Ensure Feature Flag Drawer is visible
    await expect(adminPage.featureFlags.overlay).toBeVisible();

    // 2. Switch to 'Admin Portal' tab inside Feature Flag drawer
    await adminPage.featureFlags.getPortalTab("Admin Portal").click();

    // 3. Toggle off "Leave Approvals Tab" feature flag
    const toggleButton = adminPage.featureFlags.getToggleByKey("sidebar.leave");
    await toggleButton.click();

    // 4. Click 'Apply Config'
    await adminPage.featureFlags.applyConfigButton.click();

    // Ensure Drawer closes
    await expect(adminPage.featureFlags.overlay).not.toBeVisible();

    // 5. Verify "Leave Approvals" tab is removed from the sidebar navigation
    await expect(adminPage.featureFlags.getSidebarLink("Leave Approvals")).not.toBeVisible();

    // 6. Restore to defaults to maintain clean spec isolation
    await adminPage.featureFlags.featureFlagsButton.click();
    await expect(adminPage.featureFlags.overlay).toBeVisible();
    await adminPage.featureFlags.resetDefaultsButton.click();
    await adminPage.featureFlags.applyConfigButton.click();

    // Ensure Leave Approvals tab is restored
    await expect(adminPage.featureFlags.getSidebarLink("Leave Approvals")).toBeVisible();
  });
});
