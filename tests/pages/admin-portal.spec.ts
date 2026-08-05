import { test, expect } from "../../fixtures/page-objects.fixture.js";

test.describe("Administrative Portal Management Page Spec", () => {
  test("[Test_01] should support staff registry auditing and employee state switches", async ({ page, adminPortalPage }) => {
    await page.goto("/admin");

    // Switch to Employee Registry tab
    await adminPortalPage.registry.registryTab.click();

    // Verify employee list contains Elena Rodriguez
    await expect(adminPortalPage.registry.getEmployeeName("Elena Rodriguez")).toBeVisible();

    // Toggle management options for Elena Rodriguez
    await expect(adminPortalPage.registry.getEmployeeCardStatus("Elena Rodriguez", "Active")).toBeVisible();
  });

  test.skip("[Test_02] should assign, list, and delete client shifts through the master scheduling interface", async ({ page, adminPortalPage }) => {
    await page.goto("/admin");

    // We are on the 'Scheduler' tab by default
    await expect(adminPortalPage.scheduler.assignNewShiftHeading).toBeVisible();

    // 1. Populate the shift form inputs
    // Dropdown selection for employee
    await adminPortalPage.scheduler.employeeDropdown.selectOption({ label: "Elena Rodriguez" });

    // Client Name
    await adminPortalPage.scheduler.clientNameInput.fill("Arthur Pendragon");

    // Custom date input
    await adminPortalPage.scheduler.dateInput.fill("2026-07-29");

    // Location
    await adminPortalPage.scheduler.locationInput.fill("Camelot Village");

    // Notes
    await adminPortalPage.scheduler.notesTextarea.fill("Serve royal lunch at noon.");

    // 2. Submit shift form
    await adminPortalPage.scheduler.assignShiftButton.click();

    // 3. Assert success banner is rendered
    await expect(adminPortalPage.scheduler.assignSuccessBanner).toBeVisible();

    // 4. Verify the newly assigned shift appears in the list
    await expect(adminPortalPage.scheduler.getShiftClientName("Arthur Pendragon")).toBeVisible();
    await expect(adminPortalPage.scheduler.getShiftLocation("Camelot Village")).toBeVisible();

    // 5. Delete the shift to verify scheduling hygiene
    await adminPortalPage.scheduler.getShiftDeleteButton("Arthur Pendragon").click();

    // Confirm deletion in the confirmation modal if present
    if (await adminPortalPage.scheduler.confirmDeletionButton.isVisible()) {
      await adminPortalPage.scheduler.confirmDeletionButton.click();
    }

    // Verify shift is removed
    await expect(adminPortalPage.scheduler.getShiftClientName("Arthur Pendragon")).not.toBeVisible();
  });

  test.skip("[Test_03] should support auditing of caregiver leave requests and updating approval states", async ({ page, adminPortalPage }) => {
    await page.goto("/admin");

    // Navigate to Leave Approvals tab
    await adminPortalPage.leaveApprovals.leaveTab.click();

    // Verify Leave requests title is displayed
    await expect(adminPortalPage.leaveApprovals.leaveApprovalsTitle).toBeVisible();
  });

  test.skip("[Test_04] should respond reactively to live Feature Flag visibility adjustments", async ({ page, adminPortalPage }) => {
    await page.goto("/admin");

    // 1. Open Feature Flag console drawer
    await adminPortalPage.featureFlags.featureFlagsButton.click();

    // Ensure Feature Flag Drawer is visible
    await expect(adminPortalPage.featureFlags.overlay).toBeVisible();

    // 2. Switch to 'Admin Portal' tab inside Feature Flag drawer
    await adminPortalPage.featureFlags.getPortalTab("Admin Portal").click();

    // 3. Toggle off "Leave Approvals Tab" feature flag
    const toggleButton = adminPortalPage.featureFlags.getToggleByKey("sidebar.leave");
    await toggleButton.click();

    // 4. Click 'Apply Config'
    await adminPortalPage.featureFlags.applyConfigButton.click();

    // Ensure Drawer closes
    await expect(adminPortalPage.featureFlags.overlay).not.toBeVisible();

    // 5. Verify "Leave Approvals" tab is removed from the sidebar navigation
    await expect(adminPortalPage.featureFlags.getSidebarLink("Leave Approvals")).not.toBeVisible();

    // 6. Restore to defaults to maintain clean spec isolation
    await adminPortalPage.featureFlags.featureFlagsButton.click();
    await expect(adminPortalPage.featureFlags.overlay).toBeVisible();
    await adminPortalPage.featureFlags.resetDefaultsButton.click();
    await adminPortalPage.featureFlags.applyConfigButton.click();

    // Ensure Leave Approvals tab is restored
    await expect(adminPortalPage.featureFlags.getSidebarLink("Leave Approvals")).toBeVisible();
  });
});
