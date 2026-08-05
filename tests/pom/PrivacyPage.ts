import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class PrivacyPage extends BasePage {
  readonly privacyHeading: Locator;

  constructor(page: Page, request: any) {
    super(page, request);
    this.privacyHeading = page.locator("text=Comprehensive Privacy and Data Governance Policy");
  }
}
