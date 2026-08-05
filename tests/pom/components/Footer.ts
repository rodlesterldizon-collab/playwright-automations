import { Page, Locator } from "@playwright/test";

export class Footer {
  readonly page: Page;
  readonly container: Locator;
  readonly privacyPolicyLink: Locator;
  readonly termsOfServiceLink: Locator;

  /** Post-navigation targets — resolved against the full page (not footer) */
  readonly pageHeading: Locator;
  readonly pageSubheading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator("footer");
    this.privacyPolicyLink = this.container.locator("text=Privacy Policy");
    this.termsOfServiceLink = this.container.locator("text=Terms of Service");
    this.pageHeading = page.locator("h1");
    this.pageSubheading = page.locator("h2").first();
  }

  /** Resolves brand name text from CMS content (e.g. footer.brand.name) */
  getBrandText(name: string): Locator {
    return this.page.getByRole("contentinfo").getByText(name, { exact: true });
  }

  /** Resolves copyright notice text from CMS content (e.g. footer.copyright.text) */
  getCopyrightNotice(text: string): Locator {
    return this.container.locator(`text=${text}`);
  }

  /** Resolves a quick link or resource link by display name */
  getLink(name: string): Locator {
    return this.container.locator(`text=${name}`);
  }

  async clickPrivacyPolicy(): Promise<void> {
    await this.privacyPolicyLink.click();
  }

  async clickTermsOfService(): Promise<void> {
    await this.termsOfServiceLink.click();
  }
}
