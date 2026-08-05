import { test as base } from "@playwright/test";
import { EmployeePortalPage } from "../../tests/pom/EmployeePortalPage.js";
import { loginProgrammatic, getCaregiverCredentials } from "../../tests/helpers.js";

type EmployeePortalPageDefinitions = {
  employeePortalPage: EmployeePortalPage;
};

export const test = base.extend<EmployeePortalPageDefinitions>({
  employeePortalPage: async ({ context, page, request }, use) => {
    const credentials = getCaregiverCredentials();
    await loginProgrammatic(context, request, credentials.email, credentials.password);
    await use(new EmployeePortalPage(page, request));
  },
});
