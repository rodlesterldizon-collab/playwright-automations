import { test as base, expect } from "@playwright/test";
import { setupCmsPage, fetchCmsContent, CmsContent, getHomeData } from "../helpers.js";
import { HomePage } from "../pom/HomePage.js";

const homeData = getHomeData();

const test = base.extend<{
  homePage: HomePage;
  home: CmsContent;
}>({
  homePage: async ({ page, request }, use) => {
    await setupCmsPage(page, request, "home", "/");
    await use(new HomePage(page, request));
  },
  home: async ({ request }, use) => {
    const data = await fetchCmsContent(request, "home");
    await use(data);
  },
});

test.describe("Public Landing Homepage E2E Spec", () => {
  // ─── Hero Section ────────────────────────────────────────────────────────────

  test("[Test_01] should render the hero section using CMS copy and verify CTAs scroll correctly", async ({ page, homePage, home }) => {
    const { hero } = homePage;

    // Badge / trust signal
    await expect(hero.getBadgeText(home.hero.badge)).toBeVisible();

    // Heading prefix
    await expect(hero.getTitleText(home.hero.titlePrefix)).toBeVisible();

    // Paragraph body
    await expect(hero.description).toBeVisible();

    // Services CTA
    const servicesCta = hero.getServicesCta(home.hero.ctaServices);
    await expect(servicesCta).toBeVisible();

    // Hire CTA — click should anchor to #contact and focus
    const hireCta = hero.getHireCta(home.hero.ctaHire);
    await expect(hireCta).toBeVisible();
    await hireCta.click();
    await expect(hireCta).toBeFocused();

    // Scroll evaluation
    await page.waitForFunction(() => window.scrollY > 0);
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBeGreaterThan(0);

    // URL hash must reflect hire CTA href
    await expect(page).toHaveURL(new RegExp(home.hero.ctaHireHref));
    await expect(hero.getAnchorTarget(home.hero.ctaHireHref)).toBeVisible();

    // Services CTA should scroll to #services
    await servicesCta.scrollIntoViewIfNeeded();
    await servicesCta.click();
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeGreaterThan(0);
    await expect(page).toHaveURL(new RegExp(home.hero.ctaServicesHref));
  });

  // ─── Stats / Metrics Grid ────────────────────────────────────────────────────

  test("[Test_02] should render the stats grid with CMS values and labels", async ({ homePage, home }) => {
    const { stats } = homePage;
    for (const item of home.stats.items) {
      await expect(stats.getStatValue(item.value)).toBeVisible();
      await expect(stats.getStatLabel(item.label)).toBeVisible();
    }
  });

  // ─── About / Mission Section ──────────────────────────────────────────────────

  test("[Test_03] should verify the mission section title, description, and all feature cards are visible", async ({ homePage, home }) => {
    const { about } = homePage;

    // Section image
    await expect(about.image).toBeVisible();

    // Section heading and description paragraph
    await expect(about.getTitle(home.about.title)).toBeVisible();
    await expect(about.getDescription(home.about.description)).toBeVisible();

    // Each feature card: heading, paragraph, and icon
    for (let i = 0; i < home.about.features.length; i++) {
      const feature = home.about.features[i];
      await expect(about.getFeatureTitle(i)).toContainText(feature.title);
      await expect(about.getFeatureDescription(i)).toContainText(feature.description);
      await expect(about.getFeatureSvg(i)).toBeVisible();
    }
  });

  // ─── Services Grid ───────────────────────────────────────────────────────────

  test("[Test_04] should verify the services section heading and all service cards match CMS data", async ({ homePage, home }) => {
    const { services } = home;
    const { services: servicesSection } = homePage;

    // Section heading
    await expect(servicesSection.title).toHaveText(services.title);
    await expect(servicesSection.description).toContainText(services.description);

    // Card 0 — In-Home Care
    await expect(servicesSection.getCardTitle(0)).toHaveText(services.items[0].title);
    await expect(servicesSection.getCardDescription(0)).toBeVisible();
    await expect(servicesSection.getCardCta(0)).toContainText(services.items[0].cta);

    // Card 1 — Nursing Care
    await expect(servicesSection.getCardTitle(1)).toHaveText(services.items[1].title);
    await expect(servicesSection.getCardDescription(1)).toBeVisible();
    await expect(servicesSection.getCardCta(1)).toContainText(services.items[1].cta);

    // Card 2 — Companionship
    await expect(servicesSection.getCardTitle(2)).toHaveText(services.items[2].title);
    await expect(servicesSection.getCardDescription(2)).toBeVisible();
    await expect(servicesSection.getCardCta(2)).toContainText(services.items[2].cta);

    // Card 3 — Specialized Dementia Care (includes highlight pills)
    await expect(servicesSection.getCardTitle(3)).toHaveText(services.items[3].title);
    await expect(servicesSection.getCardDescription(3)).toBeVisible();
    await expect(servicesSection.getCardHighlight(3, 0)).toHaveText(services.items[3].highlights[0]);
    await expect(servicesSection.getCardHighlight(3, 1)).toHaveText(services.items[3].highlights[1]);
    await expect(servicesSection.getCardHighlight(3, 2)).toHaveText(services.items[3].highlights[2]);
  });

  // ─── Contact / Consultation Form ─────────────────────────────────────────────

  test("[Test_05] should validate form constraints and successfully dispatch a care consultation", async ({ page, homePage, home }) => {
    const { form } = home.contact;
    const inputData = homeData.consultationForm.desktop;
    const { contact: contactSection } = homePage;

    // Intercept /api/consultation POST and wait for it
    await page.route("**/api/consultation", async (route) => {
      const response = await page.request.post("https://compassion-care.ai.studio/api/consultation", {
        data: route.request().postDataJSON()
      });
      await route.fulfill({ response });
    });

    // Create a promise to wait for the API response
    const apiResponsePromise = page.waitForResponse("**/api/consultation");

    // Attempt invalid empty submission to trigger client-side validation
    await contactSection.getSubmitButton(form.cta).click();

    // Fill in fields using helper method
    await contactSection.fillForm({
      name: inputData.name,
      email: inputData.email,
      phone: inputData.phone,
      typeOfCare: inputData.typeOfCare,
      helpDescription: inputData.helpDescription
    });

    // Submit form
    await contactSection.getSubmitButton(form.cta).click();

    // Wait for endpoint handshake
    const apiResponse = await apiResponsePromise;
    expect(apiResponse.status()).toBe(200);

    // Verify success banner matches CMS copy
    await expect(contactSection.getSuccessTitle(form.successMessage.title)).toBeVisible();
    await expect(contactSection.getSuccessDescription(form.successMessage.description)).toBeVisible();
  });

  // ─── Contact Section Info ─────────────────────────────────────────────────────

  test("[Test_06] should render the contact section title, description, and contact info from CMS", async ({ homePage, home }) => {
    const { contact } = home;
    const { contact: contactSection } = homePage;

    await expect(contactSection.getTitle(contact.title)).toBeVisible();

    // Contact info details
    const { phone, email, address } = contact.contactInfo;
    await expect(contactSection.getContactInfo(phone)).toBeVisible();
    await expect(contactSection.getContactInfo(email)).toBeVisible();
    await expect(contactSection.getContactInfo(address)).toBeVisible();
  });
});
