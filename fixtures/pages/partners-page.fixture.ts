import { test as base } from "@playwright/test";
import { PartnersPage } from "../../tests/pom/PartnersPage.js";
import { setupCmsPage } from "../../tests/helpers.js";

type PartnersPageDefinitions = {
  partnersPage: PartnersPage;
};

export const test = base.extend<PartnersPageDefinitions>({
  partnersPage: async ({ page, request }, use) => {
    await setupCmsPage(page, request, "corporate", "/partners");
    await use(new PartnersPage(page, request));
  },
});
