import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class HomePageHeroSection {
  readonly page: Page;
  readonly container: Locator;
  readonly badge: Locator;
  readonly title: Locator;
  readonly description: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator("section").first();
    this.badge = this.container.locator("span");
    this.title = this.container.locator("h1");
    this.description = this.container.locator("p");
  }

  getServicesCta(text: string): Locator {
    return this.container.locator(`button:has-text("${text}")`);
  }

  getHireCta(text: string): Locator {
    return this.container.locator(`button:has-text("${text}")`);
  }

  /** Text node scoped inside the badge element */
  getBadgeText(text: string): Locator {
    return this.badge.locator(`text=${text}`);
  }

  /** Text node scoped inside the h1 title element */
  getTitleText(text: string): Locator {
    return this.title.locator(`text=${text}`);
  }

  /** Anchor target element matched by href fragment (e.g. "#contact") */
  getAnchorTarget(href: string): Locator {
    return this.page.locator(href);
  }
}

export class HomePageStatsSection {
  readonly container: Locator;

  constructor(page: Page) {
    this.container = page.locator("section").nth(1);
  }

  getStatValue(value: string): Locator {
    return this.container.locator(`span:has-text("${value}")`);
  }

  getStatLabel(label: string): Locator {
    return this.container.locator(`span:has-text("${label}")`);
  }
}

export class HomePageAboutSection {
  readonly container: Locator;
  readonly image: Locator;

  constructor(page: Page) {
    this.container = page.locator("#about");
    this.image = this.container.locator("picture").first();
  }

  getTitle(text: string): Locator {
    return this.container.locator(`h2:has-text("${text}")`);
  }

  getDescription(text: string): Locator {
    return this.container.locator(`p:has-text("${text}")`);
  }

  getFeatureTitle(index: number): Locator {
    return this.container.locator("h4").nth(index);
  }

  getFeatureDescription(index: number): Locator {
    return this.container.locator("p").nth(index + 1);
  }

  getFeatureSvg(index: number): Locator {
    return this.container.locator("svg").nth(index);
  }
}

export class HomePageServicesSection {
  readonly container: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.container = page.locator("#services");
    this.title = this.container.locator("h2").first();
    this.description = this.container.locator("p").first();
    this.cards = this.container.locator(".grid > div");
  }

  getCard(index: number): Locator {
    return this.cards.nth(index);
  }

  /** h3 heading text scoped to a card */
  getCardTitle(index: number): Locator {
    return this.getCard(index).locator("h3");
  }

  /** Description paragraph scoped to a card */
  getCardDescription(index: number): Locator {
    return this.getCard(index).locator("p");
  }

  /** CTA button scoped to a card */
  getCardCta(index: number): Locator {
    return this.getCard(index).locator("button");
  }

  /** Highlight pill span scoped to a card by position */
  getCardHighlight(cardIndex: number, spanIndex: number): Locator {
    return this.getCard(cardIndex).locator("span").nth(spanIndex);
  }
}

export class HomePageContactSection {
  readonly container: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly typeOfCareSelect: Locator;
  readonly helpDescriptionTextarea: Locator;

  constructor(page: Page) {
    this.container = page.locator("#contact");
    this.nameInput = this.container.locator('input[name="name"]');
    this.emailInput = this.container.locator('input[name="email"]');
    this.phoneInput = this.container.locator('input[name="phone"]');
    this.typeOfCareSelect = this.container.locator('select[name="typeOfCare"]');
    this.helpDescriptionTextarea = this.container.locator('textarea[name="helpDescription"]');
  }

  getTitle(text: string): Locator {
    return this.container.locator(`h2:has-text("${text}")`);
  }

  /** Contact info text (phone, email, address) scoped within the contact container */
  getContactInfo(text: string): Locator {
    return this.container.locator(`text=${text}`);
  }

  getSubmitButton(ctaText: string): Locator {
    return this.container.locator(`button:has-text("${ctaText}")`);
  }

  getSuccessTitle(text: string): Locator {
    return this.container.locator(`h3:has-text("${text}")`);
  }

  getSuccessDescription(text: string): Locator {
    return this.container.locator(`p:has-text("${text}")`);
  }

  async fillForm(data: {
    name: string;
    email: string;
    phone: string;
    typeOfCare: string;
    helpDescription: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.typeOfCareSelect.selectOption({ label: data.typeOfCare });
    await this.helpDescriptionTextarea.fill(data.helpDescription);
  }
}

export class HomePage extends BasePage {
  readonly hero: HomePageHeroSection;
  readonly stats: HomePageStatsSection;
  readonly about: HomePageAboutSection;
  readonly services: HomePageServicesSection;
  readonly contact: HomePageContactSection;

  constructor(page: Page, request: any) {
    super(page, request);
    this.hero = new HomePageHeroSection(page);
    this.stats = new HomePageStatsSection(page);
    this.about = new HomePageAboutSection(page);
    this.services = new HomePageServicesSection(page);
    this.contact = new HomePageContactSection(page);
  }
}
