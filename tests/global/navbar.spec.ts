import { test as base, expect } from "@playwright/test";
import { fetchCmsContent, setupCmsPage, CmsContent } from "../helpers.js";
import { HomePage } from "../pom/HomePage.js";
import { PartnersPage } from "../pom/PartnersPage.js";
import { LoginPage } from "../pom/LoginPage.js";
import { PrivacyPage } from "../pom/PrivacyPage.js";

export interface NavigationLink {
  name: string;
  href: string;
  visible?: boolean;
}

const test = base.extend<{
  homePage: HomePage;
  partnersPage: PartnersPage;
  loginPage: LoginPage;
  privacyPage: PrivacyPage;
  nav: { links: NavigationLink[] };
  corporate: CmsContent;
}>({
  homePage: async ({ page, request }, use) => {
    await setupCmsPage(page, request, "home", "/");
    await use(new HomePage(page, request));
  },
  partnersPage: async ({ page, request }, use) => {
    await use(new PartnersPage(page, request));
  },
  loginPage: async ({ page, request }, use) => {
    await use(new LoginPage(page, request));
  },
  privacyPage: async ({ page, request }, use) => {
    await use(new PrivacyPage(page, request));
  },
  nav: async ({ request }, use) => {
    const data = (await fetchCmsContent(request, "navigation")) as { links: NavigationLink[] };
    await use(data);
  },
  corporate: async ({ request }, use) => {
    const data = await fetchCmsContent(request, "corporate");
    await use(data);
  },
});

test.describe("Global Header Navigation Bar Spec", () => {
  test("[Test_01] should render the brand logo and brand text", async ({ homePage }) => {
    await expect(homePage.navbar.logoBtn).toBeVisible();
    await expect(homePage.navbar.brandText).toBeVisible();
  });

  test("[Test_02] should render all visible navigation links from CMS", async ({ homePage, nav }) => {
    const visibleLinks = nav.links.filter((l) => l.visible !== false);
    for (const link of visibleLinks) {
      await expect(homePage.navbar.getNavLink(link.name)).toBeVisible();
    }
  });

  test("[Test_03] should not render links marked visible:false in CMS", async ({ homePage, nav }) => {
    const hiddenLinks = nav.links.filter((l) => l.visible === false);
    for (const link of hiddenLinks) {
      await expect(homePage.navbar.getNavLink(link.name)).not.toBeVisible();
    }
  });

  test("[Test_04] should navigate smoothly to the B2B Corporate partnerships view", async ({
    page,
    homePage,
    partnersPage,
    nav,
    corporate,
  }) => {
    const link = nav.links.find((l) => l.name === "Partnerships")!;
    await homePage.navbar.clickNavLink(link.name);
    await expect(page).toHaveURL(new RegExp(`${link.href}$`));
    await expect(partnersPage.hero.title).toContainText(corporate.hero.titlePrefix);
  });

  test("[Test_05] should navigate to the Staff Login Portal screen", async ({ page, homePage, loginPage, nav }) => {
    const link = nav.links.find((l) => l.name === "Portal")!;
    await homePage.navbar.clickNavLink(link.name);
    await expect(page).toHaveURL(new RegExp(`${link.href}$`));
    await expect(loginPage.portalHeading).toBeVisible();
  });

  test("[Test_06] should navigate to the Privacy Policy screen", async ({ page, homePage, privacyPage, nav }) => {
    const link = nav.links.find((l) => l.name === "Privacy")!;
    await homePage.navbar.clickNavLink(link.name);
    await expect(page).toHaveURL(new RegExp(`${link.href}$`));
    await expect(privacyPage.privacyHeading).toBeVisible();
  });

  test("[Test_07] should return to homepage when logo is clicked", async ({ page, homePage, nav }) => {
    const homeLink = nav.links.find((l) => l.name === "Home")!;
    const partnerLink = nav.links.find((l) => l.name === "Partnerships")!;

    await homePage.navbar.clickNavLink(partnerLink.name);
    await expect(page).toHaveURL(new RegExp(`${partnerLink.href}$`));

    await homePage.navbar.clickLogo();
    await expect(page).toHaveURL(new RegExp(`${homeLink.href}$`));
  });
});
