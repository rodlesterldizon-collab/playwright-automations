import { test, expect } from "../../fixtures/page-objects.fixture.js";
import { getPartnersData } from "../helpers.js";

const partnersData = getPartnersData();

test.describe("Corporate Partnerships Spec", () => {
  // ─── Hero Section ─────────────────────────────────────────────────────────────

  test("[Test_01] @smoke should render the corporate branding hero and navigation triggers", async ({ partnersPage, corporateCms }) => {
    const { navigation, hero } = corporateCms;
    const { hero: heroSection } = partnersPage;

    // Navigation badge
    await expect(heroSection.getBadgeText(navigation.badge)).toBeVisible();

    // Main heading
    await expect(heroSection.title).toContainText(hero.titlePrefix);
    await expect(heroSection.title).toContainText(hero.titleHighlight);

    // Description paragraph
    await expect(heroSection.description).toContainText(hero.description);

    // Secondary tagline / trust marker
    await expect(heroSection.trustMarker).toBeVisible();

    // Hero image
    await expect(heroSection.image).toBeVisible();

    // Primary CTA
    await expect(heroSection.primaryCta).toHaveText(hero.cta);

    // Secondary CTA
    await expect(heroSection.secondaryCta).toHaveText(hero.ctaSecondary);
  });

  // ─── How It Works ─────────────────────────────────────────────────────────────

  test("[Test_02] should render the how-it-works section title and contact link", async ({ partnersPage, corporateCms }) => {
    const { howItWorks } = corporateCms;
    await expect(partnersPage.howItWorks.getTitle(howItWorks.title)).toBeVisible();
    await expect(partnersPage.howItWorks.getLink(howItWorks.link.text)).toBeVisible();
  });

  // ─── Features / Bento Grid ────────────────────────────────────────────────────

  test("[Test_03] should verify on-demand certified professionals benefits bento layout", async ({ page, partnersPage, corporateCms }) => {
    const { features } = corporateCms;
    const { features: featuresSection } = partnersPage;

    // Section heading
    await expect(featuresSection.title).toContainText(features.absoluteReliability.title);
    await expect(featuresSection.description).toContainText(features.absoluteReliability.description);

    // Card 0 — Reliable On-Demand Staffing (with highlight pills)
    await expect(featuresSection.getCardSvg(0)).toBeVisible();
    await expect(featuresSection.getCardTitle(0)).toHaveText(features.onDemandStaffing.title);
    await expect(featuresSection.getCardDescription(0)).toContainText(features.onDemandStaffing.description);
    await expect(featuresSection.getCardHighlight(0, 0)).toHaveText(features.onDemandStaffing.highlights[0]);
    await expect(featuresSection.getCardHighlight(0, 1)).toHaveText(features.onDemandStaffing.highlights[1]);

    // Card 1 — Personal, Compassionate Care (with list items)
    await expect(featuresSection.getCardSvg(1)).toBeVisible();
    await expect(featuresSection.getCardTitle(1)).toHaveText(features.certifiedProfessionals.title);
    await expect(featuresSection.getCardDescription(1)).toContainText(features.certifiedProfessionals.description);
    await expect(featuresSection.getCardListItem(1, 0)).toContainText(features.certifiedProfessionals.list[0]);
    await expect(featuresSection.getCardListItem(1, 1)).toContainText(features.certifiedProfessionals.list[1]);

    // Card 2 — Simple, Direct Coordination (with CTA scroll trigger)
    await expect(featuresSection.getCardPicture(2)).toBeVisible();
    await expect(featuresSection.getCardSvg(2)).toBeVisible();
    await expect(featuresSection.getCardTitle(2)).toHaveText(features.easyManagement.title);
    await expect(featuresSection.getCardDescription(2)).toContainText(features.easyManagement.description);

    const managementBtn = featuresSection.getCardButton(2);
    await expect(managementBtn).toBeVisible();
    await managementBtn.click();
    await expect(managementBtn).toBeFocused();

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  // ─── ROI Calculator ───────────────────────────────────────────────────────────

  test("[Test_04] should calculate correct ROI estimates inside the interactive savings widget", async ({ partnersPage, corporateCms }) => {
    const { calculator } = corporateCms;
    const { calculator: calcSection } = partnersPage;

    // Section headings
    await expect(calcSection.getLabel("Interactive ROI Tool").first()).toBeVisible();
    await expect(calcSection.getTitle(calculator.title)).toBeVisible();
    await expect(calcSection.getDescription(calculator.description)).toBeVisible();

    // Slider 1 — resident count with label
    await expect(calcSection.getLabel(calculator.labels.residentCount)).toBeVisible();
    await expect(calcSection.residentCountSlider).toBeVisible();

    // Slider 2 — weekly shifts with label
    await expect(calcSection.getLabel(calculator.labels.weeklyShifts)).toBeVisible();
    await expect(calcSection.weeklyShiftsSlider).toBeVisible();

    // Care level selector label and buttons
    await expect(calcSection.getLabel(calculator.labels.careLevel)).toBeVisible();
    await expect(calcSection.getCareLevelButton(calculator.labels.careLevels[0])).toBeVisible();
    await expect(calcSection.getCareLevelButton(calculator.labels.careLevels[1])).toBeVisible();
    await expect(calcSection.getCareLevelButton(calculator.labels.careLevels[2])).toBeVisible();

    // Impact summary panel — title and row labels
    await expect(calcSection.getImpactTitle(calculator.impact.title)).toBeVisible();
    await expect(calcSection.getLabel(calculator.impact.weeklyCost)).toBeVisible();
    await expect(calcSection.getLabel(calculator.impact.agencyCost)).toBeVisible();
    await expect(calcSection.getLabel(calculator.impact.annualSavings)).toBeVisible();
    await expect(calcSection.getLabel(calculator.impact.disclaimer)).toBeVisible();

    // Assert initial computed numbers (default: 10 residents, 8 shifts, Standard PSW @ $28/hr)
    await expect(calcSection.getImpactValue("$896")).toBeVisible();    // CompassionCare weekly cost
    await expect(calcSection.getImpactValue("$1,210")).toBeVisible();  // Traditional agency cost
    await expect(calcSection.getImpactValue("$16,328")).toBeVisible(); // Annualized savings
  });

  // ─── Testimonial ──────────────────────────────────────────────────────────────

  test("[Test_05] should render the testimonial quote, author, and role from CMS", async ({ partnersPage, corporateCms }) => {
    const { testimonial } = corporateCms;
    await expect(partnersPage.testimonial.getQuote(testimonial.quote)).toBeVisible();
    await expect(partnersPage.testimonial.getAuthor(testimonial.author)).toBeVisible();
    await expect(partnersPage.testimonial.getRole(testimonial.role)).toBeVisible();
  });

  // ─── Partnership Inquiry Form ─────────────────────────────────────────────────

  test("[Test_06] should render the inquiry section title, description, and footer note", async ({ partnersPage, corporateCms }) => {
    const { inquiry } = corporateCms;
    await expect(partnersPage.inquiry.getTitle(inquiry.title)).toBeVisible();
    await expect(partnersPage.inquiry.getDescription(inquiry.description)).toBeVisible();
    await expect(partnersPage.inquiry.getFooterNote(inquiry.footer)).toBeVisible();
  });

  test("[Test_07] should dispatch corporate partnership intake inquiries successfully", async ({ page, partnersPage, corporateCms }) => {
    const { inquiry } = corporateCms;
    const { inquiry: inquirySection } = partnersPage;
    const inputData = partnersData.inquiryForm.desktop;

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

    // Verify successful feedback
    await expect(inquirySection.successTitle).toBeVisible();
    await expect(inquirySection.successBody).toBeVisible();
  });

  // ─── Contact Info ─────────────────────────────────────────────────────────────

  test("[Test_08] should render the contact address, email, and phone from CMS", async ({ partnersPage, corporateCms }) => {
    const { contact } = corporateCms;
    await expect(partnersPage.contact.getContactDetail(contact.address)).toBeVisible();
    await expect(partnersPage.contact.getContactDetail(contact.email)).toBeVisible();
    await expect(partnersPage.contact.getContactDetail(contact.phone)).toBeVisible();
  });
});
