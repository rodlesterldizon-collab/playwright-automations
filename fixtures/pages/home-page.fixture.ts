import { test as base } from "@playwright/test";
import { HomePage } from "../../tests/pom/HomePage.js";
import { setupCmsPage } from "../../tests/helpers.js";

type HomePageDefinitions = {
  homePage: HomePage;
};

export const test = base.extend<HomePageDefinitions>({
  homePage: async ({ page, request }, use) => {
    await setupCmsPage(page, request, "home", "/");
    await use(new HomePage(page, request));
  },
});
