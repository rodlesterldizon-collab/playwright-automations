import { test, expect } from "../../fixtures/page-objects.fixture.js";
import { getHomeData } from "../helpers.js";

test.describe("Public Landing Homepage Tablet Viewport Spec (768x1024)", () => {
  const homeData = getHomeData();

  // ─── Tablet Hero Section ──────────────────────────────────────────────────────

  test("[Test_01] should render tablet hero section with visible branding and CTAs", async ({ homePage, homeCms }) => {
    const { hero } = homePage;
    await expect(hero.getBadgeText(homeCms.hero.badge)).toBeVisible();
    await expect(hero.getTitleText(homeCms.hero.titlePrefix)).toBeVisible();
    await expect(hero.description).toBeVisible();
    await expect(hero.getServicesCta(homeCms.hero.ctaServices)).toBeVisible();
    await expect(hero.getHireCta(homeCms.hero.ctaHire)).toBeVisible();
  });

  // ─── Tablet Stats Grid ───────────────────────────────────────────────────────

  test("[Test_02] should render 2x2 stats grid with all CMS values on tablet", async ({ homePage, homeCms }) => {
    const { stats } = homePage;
    for (const item of homeCms.stats.items) {
      await expect(stats.getStatValue(item.value)).toBeVisible();
      await expect(stats.getStatLabel(item.label)).toBeVisible();
    }
  });

  // ─── Tablet About Section ─────────────────────────────────────────────────────

  test("[Test_03] should render mission section and all 4 feature cards on tablet viewport", async ({ homePage, homeCms }) => {
    const { about } = homePage;
    await expect(about.getTitle(homeCms.about.title)).toBeVisible();
    await expect(about.getDescription(homeCms.about.description)).toBeVisible();

    for (let i = 0; i < homeCms.about.features.length; i++) {
      const feature = homeCms.about.features[i];
      await expect(about.getFeatureTitle(i)).toContainText(feature.title);
      await expect(about.getFeatureDescription(i)).toContainText(feature.description);
    }
  });

  // ─── Tablet Services Grid ─────────────────────────────────────────────────────

  test("[Test_04] should render all 4 service cards in tablet grid layout", async ({ homePage, homeCms }) => {
    const { services } = homeCms;
    const { services: servicesSection } = homePage;
    await expect(servicesSection.title).toHaveText(services.title);

    for (let i = 0; i < services.items.length; i++) {
      await expect(servicesSection.getCardTitle(i)).toHaveText(services.items[i].title);
      await expect(servicesSection.getCardDescription(i)).toBeVisible();
    }
  });

  // ─── Tablet Contact Form ──────────────────────────────────────────────────────

  test("[Test_05] should allow typing and dispatching consultation form on tablet", async ({ page, homePage, homeCms }) => {
    const { form } = homeCms.contact;
    const inputData = homeData.consultationForm.tablet;
    const { contact: contactSection } = homePage;

    await page.route("**/api/consultation", async (route) => {
      const response = await page.request.post("https://compassion-care.ai.studio/api/consultation", {
        data: route.request().postDataJSON()
      });
      await route.fulfill({ response });
    });

    const apiResponsePromise = page.waitForResponse("**/api/consultation");

    await contactSection.container.scrollIntoViewIfNeeded();

    await contactSection.fillForm({
      name: inputData.name,
      email: inputData.email,
      phone: inputData.phone,
      typeOfCare: inputData.typeOfCare,
      helpDescription: inputData.helpDescription
    });

    await contactSection.getSubmitButton(form.cta).click();

    const apiResponse = await apiResponsePromise;
    expect(apiResponse.status()).toBe(200);

    await expect(contactSection.getSuccessTitle(form.successMessage.title)).toBeVisible();
  });
});
