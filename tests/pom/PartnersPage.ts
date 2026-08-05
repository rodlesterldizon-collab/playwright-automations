import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class PartnersHeroSection {
  readonly container: Locator;
  readonly badge: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly trustMarker: Locator;
  readonly image: Locator;
  readonly primaryCta: Locator;
  readonly secondaryCta: Locator;

  constructor(page: Page) {
    this.container = page.locator("section").first();
    this.badge = this.container.locator("span").first();
    this.title = this.container.locator("h1");
    this.description = this.container.locator("p").first();
    this.trustMarker = this.container.locator("span").last();
    this.image = this.container.locator("picture");
    this.primaryCta = this.container.locator("button").first();
    this.secondaryCta = this.container.locator("button").last();
  }

  /** Text node scoped inside the badge span */
  getBadgeText(text: string): Locator {
    return this.badge.locator(`text=${text}`);
  }
}

export class PartnersHowItWorksSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getTitle(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  getLink(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }
}

export class PartnersFeaturesSection {
  readonly container: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.container = page.locator("section").nth(1);
    this.title = this.container.locator("h2");
    this.description = this.container.locator("p").first();
    this.cards = this.container.locator(".grid > div");
  }

  getCard(index: number): Locator {
    return this.cards.nth(index);
  }

  /** SVG icon scoped to a card */
  getCardSvg(index: number): Locator {
    return this.getCard(index).locator("svg").first();
  }

  /** h3 heading scoped to a card */
  getCardTitle(index: number): Locator {
    return this.getCard(index).locator("h3");
  }

  /** Description paragraph scoped to a card */
  getCardDescription(index: number): Locator {
    return this.getCard(index).locator("p");
  }

  /** Highlight pill span scoped to a card by position */
  getCardHighlight(cardIndex: number, spanIndex: number): Locator {
    return this.getCard(cardIndex).locator("span").nth(spanIndex);
  }

  /** First highlight span on a card (mobile/tablet shorthand) */
  getCardFirstHighlight(index: number): Locator {
    return this.getCard(index).locator("span").first();
  }

  /** List item scoped to a card by position */
  getCardListItem(cardIndex: number, liIndex: number): Locator {
    return this.getCard(cardIndex).locator("ul > li").nth(liIndex);
  }

  /** First list item scoped to a card (mobile/tablet shorthand) */
  getCardFirstListItem(index: number): Locator {
    return this.getCard(index).locator("ul > li").first();
  }

  /** Picture element scoped to a card */
  getCardPicture(index: number): Locator {
    return this.getCard(index).locator("picture");
  }

  /** CTA button scoped to a card */
  getCardButton(index: number): Locator {
    return this.getCard(index).locator("button");
  }
}

export class PartnersRoiCalculatorSection {
  readonly container: Locator;
  readonly residentCountSlider: Locator;
  readonly weeklyShiftsSlider: Locator;

  constructor(page: Page) {
    this.container = page.locator("section").nth(2);
    this.residentCountSlider = this.container.locator('input[type="range"]').nth(0);
    this.weeklyShiftsSlider = this.container.locator('input[type="range"]').nth(1);
  }

  getTitle(text: string): Locator {
    return this.container.locator(`h2:has-text("${text}")`);
  }

  getDescription(text: string): Locator {
    return this.container.locator(`p:has-text("${text}")`);
  }

  getLabel(text: string): Locator {
    return this.container.locator(`text=${text}`);
  }

  getCareLevelButton(text: string): Locator {
    return this.container.locator(`button:has-text("${text}")`);
  }

  getImpactTitle(text: string): Locator {
    return this.container.locator(`h3:has-text("${text}")`);
  }

  getImpactValue(text: string): Locator {
    return this.container.locator(`text=${text}`);
  }
}

export class PartnersTestimonialSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getQuote(text: string): Locator {
    return this.page.getByText(text, { exact: false });
  }

  getAuthor(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  getRole(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }
}

export class PartnersInquirySection {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly orgTypeSelect: Locator;
  readonly needsTextarea: Locator;
  readonly successTitle: Locator;
  readonly successBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.orgTypeSelect = page.locator('select[name="orgType"]');
    this.needsTextarea = page.locator('textarea[name="needs"]');
    this.successTitle = page.locator("text=Inquiry Received");
    this.successBody = page.locator("text=/Our partnerships director is reviewing your staffing/i");
  }

  getTitle(text: string): Locator {
    return this.page.locator(`h2:has-text("${text}")`);
  }

  getDescription(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  getFooterNote(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  getSubmitButton(ctaText: string): Locator {
    return this.page.locator(`button:has-text("${ctaText}")`);
  }

  async fillInquiry(data: {
    name: string;
    email: string;
    orgType: string;
    needs: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.orgTypeSelect.selectOption({ label: data.orgType });
    await this.needsTextarea.fill(data.needs);
  }
}

export class PartnersContactSection {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getContactDetail(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }
}

export class PartnersPage extends BasePage {
  readonly hero: PartnersHeroSection;
  readonly howItWorks: PartnersHowItWorksSection;
  readonly features: PartnersFeaturesSection;
  readonly calculator: PartnersRoiCalculatorSection;
  readonly testimonial: PartnersTestimonialSection;
  readonly inquiry: PartnersInquirySection;
  readonly contact: PartnersContactSection;

  constructor(page: Page, request: any) {
    super(page, request);
    this.hero = new PartnersHeroSection(page);
    this.howItWorks = new PartnersHowItWorksSection(page);
    this.features = new PartnersFeaturesSection(page);
    this.calculator = new PartnersRoiCalculatorSection(page);
    this.testimonial = new PartnersTestimonialSection(page);
    this.inquiry = new PartnersInquirySection(page);
    this.contact = new PartnersContactSection(page);
  }
}
