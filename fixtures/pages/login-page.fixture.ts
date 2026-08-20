import { test as base } from "@playwright/test";
import { LoginPage } from "../../tests/pom/LoginPage.js";

type LoginPageDefinitions = {
  loginPage: LoginPage;
};

export const test = base.extend<LoginPageDefinitions>({
  loginPage: async ({ page, request }, use) => {
    const loginPage = new LoginPage(page, request);
    await loginPage.navigate();
    await use(loginPage);
  },
});
