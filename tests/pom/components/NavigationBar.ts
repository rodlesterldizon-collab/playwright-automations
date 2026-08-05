import { Page, Locator } from "@playwright/test";
import { CmsContent } from "../helpers.js";

export class NavigationBar {
  readonly page: Page;
  readonly container: Locator;
  readonly logoBtn: Locator;
  readonly brandText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator("header");
    // Logo renders as a button in the DOM, not an anchor
    this.logoBtn = page.getByRole("button", {
      name: /CompassionCare Logo - Return to Homepage/i,
    });
    this.brandText = this.logoBtn.locator("text=CompassionCare");
  }

  /** Returns a nav link locator by its CMS name. Works for both buttons and links inside nav. */
  getNavLink(name: string): Locator {
    return this.container.getByRole("navigation").getByRole("button", { name, exact: true });
  }

  async clickLogo(): Promise<void> {
    await this.logoBtn.click();
  }

  async clickNavLink(name: string): Promise<void> {
    await this.getNavLink(name).click();
  }
}
