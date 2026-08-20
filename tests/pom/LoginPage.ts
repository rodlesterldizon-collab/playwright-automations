import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class LoginPage extends BasePage {
  // Page headings
  readonly portalHeading: Locator;
  readonly pageTitle: Locator;
  readonly sectionHeading: Locator;
  readonly sectionSubheading: Locator;

  // Credential inputs
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  // Action links
  readonly forgotPasswordLink: Locator;
  readonly contactItSupportLink: Locator;

  // IT support form
  readonly supportEmailInput: Locator;
  readonly itSupportSubmitButton: Locator;
  readonly requestSubmittedMessage: Locator;

  // SSO
  readonly googleSsoButton: Locator;

  constructor(page: Page, request: any) {
    super(page, request);
    this.portalHeading = page.locator("h1");
    this.pageTitle = page.locator("h1");
    this.sectionHeading = page.locator("h2");
    this.sectionSubheading = page.locator("h2 + p");
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.forgotPasswordLink = page.locator("text=Forgot Password?");
    this.contactItSupportLink = page.locator("text=Contact IT Support");
    this.supportEmailInput = page.locator("#supportEmail");
    this.itSupportSubmitButton = page.locator('button[type="submit"]').nth(1);
    this.requestSubmittedMessage = page.locator("text=/Request Submitted/i");
    this.googleSsoButton = page.locator("button:has-text('Sign in with Google SSO')");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/login");
  }

  async submitItSupportRequest(email: string): Promise<void> {
    await this.contactItSupportLink.click();
    await this.supportEmailInput.fill(email);
    await this.itSupportSubmitButton.click();
  }

  async triggerForgotPassword(): Promise<string> {
    let dialogMessage = "";
    this.page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await this.forgotPasswordLink.click();
    return dialogMessage;
  }
}
