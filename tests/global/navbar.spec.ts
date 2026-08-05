import { test, expect } from "../../fixtures/page-objects.fixture.js";

test.describe("Global Header Navigation Bar Spec", () => {
  test("[Test_01] should render the brand logo and brand text", async ({ homePage }) => {
    await expect(homePage.navbar.logoBtn).toBeVisible();
    await expect(homePage.navbar.brandText).toBeVisible();
  });

  test("[Test_02] should render all visible navigation links from CMS", async ({ homePage, navCms }) => {
    const visibleLinks = navCms.links.filter((l) => l.visible !== false);
    for (const link of visibleLinks) {
      await expect(homePage.navbar.getNavLink(link.name)).toBeVisible();
    }
  });

  test("[Test_03] should not render links marked visible:false in CMS", async ({ homePage, navCms }) => {
    const hiddenLinks = navCms.links.filter((l) => l.visible === false);
    for (const link of hiddenLinks) {
      await expect(homePage.navbar.getNavLink(link.name)).not.toBeVisible();
    }
  });

  test("[Test_04] should navigate smoothly to the B2B Corporate partnerships view", async ({
    page,
    homePage,
    partnersPage,
    navCms,
    corporateCms,
  }) => {
    const link = navCms.links.find((l) => l.name === "Partnerships")!;
    await homePage.navbar.clickNavLink(link.name);
    await expect(page).toHaveURL(new RegExp(`${link.href}$`));
    await expect(partnersPage.hero.title).toContainText(corporateCms.hero.titlePrefix);
  });

  test("[Test_05] should navigate to the Staff Login Portal screen", async ({ page, homePage, loginPage, navCms }) => {
    const link = navCms.links.find((l) => l.name === "Portal")!;
    await homePage.navbar.clickNavLink(link.name);
    await expect(page).toHaveURL(new RegExp(`${link.href}$`));
    await expect(loginPage.portalHeading).toBeVisible();
  });

  test("[Test_06] should navigate to the Privacy Policy screen", async ({ page, homePage, privacyPage, navCms }) => {
    const link = navCms.links.find((l) => l.name === "Privacy")!;
    await homePage.navbar.clickNavLink(link.name);
    await expect(page).toHaveURL(new RegExp(`${link.href}$`));
    await expect(privacyPage.privacyHeading).toBeVisible();
  });

  test("[Test_07] should return to homepage when logo is clicked", async ({ page, homePage, navCms }) => {
    const homeLink = navCms.links.find((l) => l.name === "Home")!;
    const partnerLink = navCms.links.find((l) => l.name === "Partnerships")!;

    await homePage.navbar.clickNavLink(partnerLink.name);
    await expect(page).toHaveURL(new RegExp(`${partnerLink.href}$`));

    await homePage.navbar.clickLogo();
    await expect(page).toHaveURL(new RegExp(`${homeLink.href}$`));
  });
});
