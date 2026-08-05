import { test as base, expect } from "@playwright/test";
import { setupCmsPage, fetchCmsContent, CmsContent } from "../helpers.js";
import { HomePage } from "../pom/HomePage.js";

const test = base.extend<{
  homePage: HomePage;
  footer: CmsContent;
}>({
  homePage: async ({ page, request }, use) => {
    await setupCmsPage(page, request, "home", "/");
    await use(new HomePage(page, request));
  },
  footer: async ({ request }, use) => {
    const data = await fetchCmsContent(request, "footer");
    await use(data);
  },
});

test.describe("Global Footer Component Spec", () => {
  // ── Brand ──────────────────────────────────────────────────────────────────

  test("[Test_01] should render brand information and social copyright notice", async ({ homePage, footer }) => {
    await expect(homePage.footer.container).toBeVisible();
    await expect(homePage.footer.getBrandText(footer.brand.name)).toBeVisible();
    await expect(homePage.footer.getCopyrightNotice(footer.copyright.text)).toBeVisible();
  });

  test("[Test_02] should render the brand description text", async ({ homePage, footer }) => {
    await expect(
      homePage.footer.container.getByText(footer.brand.description, { exact: false })
    ).toBeVisible();
  });

  // ── Quick Links ────────────────────────────────────────────────────────────

  test("[Test_03] should render the Quick Links section heading from CMS", async ({ homePage, footer }) => {
    await expect(
      homePage.footer.container.getByRole("heading", {
        name: footer.quickLinks.title,
        exact: true,
      })
    ).toBeVisible();
  });

  test("[Test_04] should render quick links from CMS", async ({ homePage, footer }) => {
    for (const link of footer.quickLinks.links) {
      await expect(homePage.footer.getLink(link.name)).toBeVisible();
    }
  });

  // ── Resources ─────────────────────────────────────────────────────────────

  test("[Test_05] should render the Resources section heading from CMS", async ({ homePage, footer }) => {
    await expect(
      homePage.footer.container.getByRole("heading", {
        name: footer.resources.title,
        exact: true,
      })
    ).toBeVisible();
  });

  test("[Test_06] should render resource links from CMS", async ({ homePage, footer }) => {
    for (const link of footer.resources.links) {
      await expect(homePage.footer.getLink(link.name)).toBeVisible();
    }
  });

  // ── Newsletter ─────────────────────────────────────────────────────────────

  test("[Test_07] should not render newsletter section when CMS marks it not visible", async ({ homePage, footer }) => {
    if (!footer.newsletter.visible) {
      await expect(
        homePage.footer.container.getByRole("heading", { name: footer.newsletter.title })
      ).not.toBeVisible();
    }
  });

  // ── Social Links ──────────────────────────────────────────────────────────

  test("[Test_08] should render all social links from CMS", async ({ homePage, footer }) => {
    for (const social of footer.social) {
      await expect(
        homePage.footer.container.getByRole("link", { name: social.name, exact: true })
      ).toBeVisible();
    }
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  test("[Test_09] should navigate smoothly to the Privacy Policy static route", async ({ page, homePage }) => {
    await homePage.footer.clickPrivacyPolicy();
    await expect(page).toHaveURL(/\/privacy/);
    await expect(homePage.footer.pageHeading).toBeVisible();
  });

  test("[Test_10] should navigate smoothly to the Terms of Service static route", async ({ page, homePage }) => {
    await homePage.footer.clickTermsOfService();
    await expect(page).toHaveURL(/\/terms/);
    await expect(homePage.footer.pageHeading).toBeVisible();
    await expect(homePage.footer.pageSubheading).toBeVisible();
  });
});
