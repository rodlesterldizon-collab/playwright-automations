import { test, expect } from "../../fixtures/page-objects.fixture.js";
import { getPartnersData } from "../helpers.js";

test.describe("Corporate Partnerships Mobile Viewport Spec (375x812)", () => {
  const partnersData = getPartnersData();

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  // ─── Mobile Hero Section ──────────────────────────────────────────────────────

  test("[Test_01] should render corporate hero section with visible branding and CTAs on mobile", async ({ partnersPage, corporateCms }) => {
    const { navigation, hero } = corporateCms;
    const { hero: heroSection } = partnersPage;

    await expect(heroSection.getBadgeText(navigation.badge)).toBeVisible();
    await expect(heroSection.title).toContainText(hero.titlePrefix);
    await expect(heroSection.primaryCta).toHaveText(hero.cta);
    await expect(heroSection.secondaryCta).toHaveText(hero.ctaSecondary);
  });

  // ─── Mobile Bento Grid ────────────────────────────────────────────────────────

  test("[Test_02] should render stacked bento feature cards on mobile viewport", async ({ partnersPage, corporateCms }) => {
    const { features } = corporateCms;
    const { features: featuresSection } = partnersPage;

    await expect(featuresSection.title).toContainText(features.absoluteReliability.title);

    // Card 0
    await expect(featuresSection.getCardTitle(0)).toHaveText(features.onDemandStaffing.title);
    await expect(featuresSection.getCardFirstHighlight(0)).toBeVisible();

    // Card 1
    await expect(featuresSection.getCardTitle(1)).toHaveText(features.certifiedProfessionals.title);
    await expect(featuresSection.getCardFirstListItem(1)).toBeVisible();

    // Card 2
    await expect(featuresSection.getCardTitle(2)).toHaveText(features.easyManagement.title);
  });

  // ─── Mobile ROI Calculator ────────────────────────────────────────────────────

  test("[Test_03] should allow slider interaction and display ROI impact on mobile screens", async ({ partnersPage, corporateCms }) => {
    const { calculator } = corporateCms;
    const { calculator: calcSection } = partnersPage;

    await expect(calcSection.getTitle(calculator.title)).toBeVisible();
    await expect(calcSection.residentCountSlider).toBeVisible();
    await expect(calcSection.weeklyShiftsSlider).toBeVisible();
    await expect(calcSection.getCareLevelButton(calculator.labels.careLevels[0])).toBeVisible();

    await expect(calcSection.getImpactValue("$896")).toBeVisible();
    await expect(calcSection.getImpactValue("$1,210")).toBeVisible();
    await expect(calcSection.getImpactValue("$16,328")).toBeVisible();
  });

  // ─── Mobile Inquiry Form ──────────────────────────────────────────────────────

  test("[Test_04] should submit corporate partnership inquiry on mobile screen", async ({ page, partnersPage, corporateCms }) => {
    const { inquiry } = corporateCms;
    const { inquiry: inquirySection } = partnersPage;
    const inputData = partnersData.inquiryForm.mobile;

    await page.route("**/api/partnership", async (route) => {
      await route.fulfill({ status: 200, json: { success: true } });
    });

    const apiResponsePromise = page.waitForResponse("**/api/partnership");

    await inquirySection.fillInquiry({
      name: inputData.name,
      email: inputData.email,
      orgType: inputData.orgType,
      needs: inputData.needs
    });

    await inquirySection.getSubmitButton(inquiry.cta).click();

    const apiResponse = await apiResponsePromise;
    expect(apiResponse.status()).toBe(200);

    await expect(inquirySection.successTitle).toBeVisible();
  });
});
