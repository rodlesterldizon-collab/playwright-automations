import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class EmployeePortalPage extends BasePage {
  // ─── Welcome Banner ─────────────────────────────────────────────────────────
  readonly welcomeBanner: Locator;

  // ─── Shift Selector ──────────────────────────────────────────────────────────
  readonly shiftSelectorFirst: Locator;

  // ─── Clock Action Buttons ────────────────────────────────────────────────────
  readonly clockInButton: Locator;
  readonly clockOutButton: Locator;
  readonly completeButton: Locator;

  // ─── Inactivity Alert ────────────────────────────────────────────────────────
  readonly inactivityAlertTitle: Locator;
  readonly stayLoggedInButton: Locator;

  // ─── Session Timeout ─────────────────────────────────────────────────────────
  readonly sessionTimeoutMessage: Locator;

  constructor(page: Page, request: any) {
    super(page, request);

    this.welcomeBanner = page.locator("text=Welcome back");
    this.shiftSelectorFirst = page.locator('input[name="selected-shift"]').first();
    this.clockInButton = page.locator('button:has-text("Clock In")');
    this.clockOutButton = page.locator('button:has-text("Clock Out")');
    this.completeButton = page.locator('button:has-text("Complete")');
    this.inactivityAlertTitle = page.locator("text=Inactivity Security Alert");
    this.stayLoggedInButton = page.locator('button:has-text("Stay Logged In")');
    this.sessionTimeoutMessage = page.locator("text=Session timed out due to inactivity");
  }
}
