import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.js";

// ─── Employee Registry Section ───────────────────────────────────────────────

export class AdminEmployeeRegistrySection {
  readonly page: Page;
  readonly registryTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registryTab = page.locator('button:has-text("Employee Registry")');
  }

  getEmployeeCard(name: string): Locator {
    return this.page.locator("tbody tr").filter({ hasText: name });
  }

  getEmployeeName(name: string): Locator {
    return this.page.locator(`text=${name}`);
  }

  /** Status badge (e.g. "Active", "Inactive") scoped to a specific employee card */
  getEmployeeCardStatus(name: string, status: string): Locator {
    return this.getEmployeeCard(name).locator(`text=${status}`);
  }
}

// ─── Scheduler Section ───────────────────────────────────────────────────────

export class AdminSchedulerSection {
  readonly page: Page;
  readonly assignNewShiftHeading: Locator;
  readonly employeeDropdown: Locator;
  readonly clientNameInput: Locator;
  readonly dateInput: Locator;
  readonly locationInput: Locator;
  readonly notesTextarea: Locator;
  readonly assignShiftButton: Locator;
  readonly assignSuccessBanner: Locator;
  readonly confirmDeletionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.assignNewShiftHeading = page.locator('h2:has-text("Assign New Shift")');
    this.employeeDropdown = page.locator("select").first();
    this.clientNameInput = page.locator('input[placeholder="e.g. John Doe"]');
    this.dateInput = page.locator('input[type="date"]').first();
    this.locationInput = page.locator('input[placeholder="e.g. 123 Care St, City"]');
    this.notesTextarea = page.locator("textarea").first();
    this.assignShiftButton = page.locator('button:has-text("Assign Shift")');
    this.assignSuccessBanner = page.locator("text=Shifts assigned successfully!");
    this.confirmDeletionButton = page.locator('button:has-text("Confirm Deletion")');
  }

  getShiftCard(clientName: string): Locator {
    return this.page.locator(".bg-white").filter({ hasText: clientName });
  }

  getShiftClientName(name: string): Locator {
    return this.page.locator(`text=${name}`);
  }

  getShiftLocation(location: string): Locator {
    return this.page.locator(`text=${location}`);
  }

  /** First action button (delete/edit) scoped to a specific shift card */
  getShiftDeleteButton(clientName: string): Locator {
    return this.getShiftCard(clientName).locator("button").first();
  }
}

// ─── Leave Approvals Section ─────────────────────────────────────────────────

export class AdminLeaveApprovalsSection {
  readonly page: Page;
  readonly leaveTab: Locator;
  readonly leaveApprovalsTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leaveTab = page.locator('button:has-text("Leave Approvals")');
    this.leaveApprovalsTitle = page.locator("text=Leave Approvals");
  }
}

// ─── Feature Flags Section ───────────────────────────────────────────────────

export class AdminFeatureFlagsSection {
  readonly page: Page;
  readonly featureFlagsButton: Locator;
  readonly overlay: Locator;
  readonly applyConfigButton: Locator;
  readonly resetDefaultsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.featureFlagsButton = page.locator('button:has-text("Feature Flags")');
    this.overlay = page.locator("#feature-flag-overlay");
    this.applyConfigButton = page.locator("text=Apply Config");
    this.resetDefaultsButton = page.locator("text=Reset Defaults");
  }

  getPortalTab(tabName: string): Locator {
    return this.overlay.locator(`button:has-text("${tabName}")`);
  }

  getToggleByKey(key: string): Locator {
    return this.page.locator("button").filter({ hasText: key });
  }

  getSidebarLink(text: string): Locator {
    return this.page.locator("aside").locator(`text=${text}`);
  }
}

// ─── AdminPortalPage ─────────────────────────────────────────────────────────

export class AdminPortalPage extends BasePage {
  readonly registry: AdminEmployeeRegistrySection;
  readonly scheduler: AdminSchedulerSection;
  readonly leaveApprovals: AdminLeaveApprovalsSection;
  readonly featureFlags: AdminFeatureFlagsSection;

  constructor(page: Page, request: any) {
    super(page, request);
    this.registry = new AdminEmployeeRegistrySection(page);
    this.scheduler = new AdminSchedulerSection(page);
    this.leaveApprovals = new AdminLeaveApprovalsSection(page);
    this.featureFlags = new AdminFeatureFlagsSection(page);
  }
}
