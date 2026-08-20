import { test as base } from "@playwright/test";
import { AdminPortalPage } from "../../tests/pom/AdminPortalPage.js";
import { loginProgrammatic, getAdminCredentials } from "../../tests/helpers.js";

type AdminPortalPageDefinitions = {
  adminPortalPage: AdminPortalPage;
};

export const test = base.extend<AdminPortalPageDefinitions>({
  adminPortalPage: async ({ context, page, request }, use) => {
    const credentials = getAdminCredentials();
    await loginProgrammatic(context, request, credentials.email, credentials.password);
    const adminPortalPage = new AdminPortalPage(page, request);
    await adminPortalPage.navigate();
    await use(adminPortalPage);
  },
});
