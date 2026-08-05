import { mergeTests } from "@playwright/test";
import { test as HomePageTest } from "./pages/home-page.fixture.js";
import { test as PartnersPageTest } from "./pages/partners-page.fixture.js";
import { test as LoginPageTest } from "./pages/login-page.fixture.js";
import { test as AdminPortalPageTest } from "./pages/admin-portal-page.fixture.js";
import { test as EmployeePortalPageTest } from "./pages/employee-portal-page.fixture.js";
import { test as PrivacyPageTest } from "./pages/privacy-page.fixture.js";
import { test as CmsTest } from "./cms.fixture.js";

export const test = mergeTests(
  HomePageTest,
  PartnersPageTest,
  LoginPageTest,
  AdminPortalPageTest,
  EmployeePortalPageTest,
  PrivacyPageTest,
  CmsTest
);

export { expect } from "@playwright/test";
