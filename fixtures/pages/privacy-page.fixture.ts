import { test as base } from "@playwright/test";
import { PrivacyPage } from "../../tests/pom/PrivacyPage.js";

type PrivacyPageDefinitions = {
  privacyPage: PrivacyPage;
};

export const test = base.extend<PrivacyPageDefinitions>({
  privacyPage: async ({ page, request }, use) => {
    await use(new PrivacyPage(page, request));
  },
});
