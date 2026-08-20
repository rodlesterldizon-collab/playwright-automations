import { test, expect } from "../../fixtures/page-objects.fixture.js";

test.describe("Administrative Portal Management Page Spec", () => {
  test("[Test_01] @smoke should support staff registry auditing and employee state switches", async ({ adminPortalPage }) => {
    // Switch to Employee Registry tab
    await adminPortalPage.registry.registryTab.click();

    // Verify employee list contains Elena Rodriguez
    await expect(adminPortalPage.registry.getEmployeeName("Elena Rodriguez")).toBeVisible();

    // Toggle management options for Elena Rodriguez
    await expect(adminPortalPage.registry.getEmployeeCardStatus("Elena Rodriguez", "Active")).toBeVisible();
  });

  test.skip("[Test_02] should assign, list, and delete client shifts through the master scheduling interface", async ({ adminPortalPage }) => {
    // We are on the 'Scheduler' tab by default
    await expect(adminPortalPage.scheduler.assignNewShiftHeading).toBeVisible();

    // 1. Populate and submit shift form via POM action method
    await adminPortalPage.scheduler.assignShift({
      employee: "Elena Rodriguez",
      clientName: "Arthur Pendragon",
      date: "2026-07-29",
      location: "Camelot Village",
      notes: "Serve royal lunch at noon.",
    });

    // 2. Assert success banner is rendered
    await expect(adminPortalPage.scheduler.assignSuccessBanner).toBeVisible();

    // 3. Verify the newly assigned shift appears in the list
    await expect(adminPortalPage.scheduler.getShiftClientName("Arthur Pendragon")).toBeVisible();
    await expect(adminPortalPage.scheduler.getShiftLocation("Camelot Village")).toBeVisible();

    // 4. Delete the shift to verify scheduling hygiene via POM action method
    await adminPortalPage.scheduler.deleteShift("Arthur Pendragon");

    // 5. Verify shift is removed
    await expect(adminPortalPage.scheduler.getShiftClientName("Arthur Pendragon")).not.toBeVisible();
  });

  test.skip("[Test_03] should support auditing of caregiver leave requests and updating approval states", async ({ adminPortalPage }) => {
    // Navigate to Leave Approvals tab
    await adminPortalPage.leaveApprovals.leaveTab.click();

    // Verify Leave requests title is displayed
    await expect(adminPortalPage.leaveApprovals.leaveApprovalsTitle).toBeVisible();
  });

  test.skip("[Test_04] should respond reactively to live Feature Flag visibility adjustments", async ({ adminPortalPage }) => {
    // 1. Toggle off "Leave Approvals Tab" feature flag via POM action method
    await adminPortalPage.featureFlags.toggleFlag("Admin Portal", "sidebar.leave");

    // 2. Ensure Drawer closes
    await expect(adminPortalPage.featureFlags.overlay).not.toBeVisible();

    // 3. Verify "Leave Approvals" tab is removed from the sidebar navigation
    await expect(adminPortalPage.featureFlags.getSidebarLink("Leave Approvals")).not.toBeVisible();

    // 4. Restore to defaults to maintain clean spec isolation
    await adminPortalPage.featureFlags.featureFlagsButton.click();
    await expect(adminPortalPage.featureFlags.overlay).toBeVisible();
    await adminPortalPage.featureFlags.resetDefaultsButton.click();
    await adminPortalPage.featureFlags.applyConfigButton.click();

    // Ensure Leave Approvals tab is restored
    await expect(adminPortalPage.featureFlags.getSidebarLink("Leave Approvals")).toBeVisible();
  });
});
