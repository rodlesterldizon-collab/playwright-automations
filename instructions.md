# Junior QA Engineer Guide: Enterprise Playwright Automation

Welcome to the CompassionCare automated testing repository! This guide provides an end-to-end walkthrough of how our test suite is built, why we use Senior Code-First design patterns, and how you can confidently extend, maintain, and write new tests.

---

## 🎯 1. Purpose of the Test Suite

The primary mission of this test framework is to provide high-velocity, reliable quality gates across all layers of the application:
1. **Public Web Experience**: Validates marketing copy, interactive widgets (e.g. ROI savings calculators), responsive mobile/tablet layouts, and client intake forms against live CMS data.
2. **Staff & Admin Portals**: Ensures role-based security, shift scheduling, staff auditing, and caregiver operations function cleanly.
3. **Backend API Contracts**: Enforces strict JSON Schema validation (AJV), payload integrity, and performance latency SLAs (<300ms) on Content Delivery APIs.

---

## 🏛️ 2. Architectural Philosophy: Why We Ban "Quick Scripts"

### ❌ The Junior / Quick-Script Anti-Pattern
In traditional or junior test writing, scripts frequently hardcode URLs, repeat credentials, and litter raw locators with assertions inside the test body:

```typescript
// ❌ Flaky, brittle, repetitive, difficult to maintain
test('create donor record', async ({ page }) => {
  await page.goto('https://kindsight-ascend.lightning.force.com/login');
  await page.fill('#username', 'admin@org.com');
  await page.fill('#password', 'secret123');
  await page.click('#Login');
  await page.waitForTimeout(5000); // Bad: hardcoded wait
  await page.click('button.new-donor');
  await page.fill('.donor-name-input', 'John Doe');
  await page.click('.save-btn');
});
```

**Why this fails in production:**
- If an input ID changes, you must update 50 different test files.
- Tests are tightly coupled to page implementation details instead of business behavior.
- Every test wastes execution time repeatedly navigating and logging in through the UI.

### ✅ The Senior Code-First Pattern (POM + Dependency Injection)
We use **Page Object Models (POM)** coupled with **Custom Playwright Fixtures (`base.extend`)**. The test receives a pre-authenticated, initialized, and already-navigated page object directly:

```typescript
// ✅ Clean, declarative, readable, maintainable
test('creates donor record', async ({ donorDashboard }) => {
  await donorDashboard.createDonor({ name: 'John Doe', tier: 'Major Gift' });
  await expect(donorDashboard.donorRow('John Doe')).toBeVisible();
});
```

---

## 🔄 3. Summary of Refactoring Done

We audited and refactored the entire test suite to eliminate quick-script patterns:

| Area | What Was Refactored | Benefit |
| :--- | :--- | :--- |
| **Encapsulated Navigation** | Removed raw `page.goto("/login")`, `page.goto("/admin")`, and `page.goto("/dashboard")` from all test bodies. Moved route navigation into Page Object `navigate()` methods and fixtures. | Tests focus purely on assertions and business flows; URL routing is managed in one central place. |
| **High-Level Semantic Methods** | Added methods like `loginPage.submitItSupportRequest(email)`, `adminPortalPage.scheduler.assignShift(data)`, `adminPortalPage.scheduler.deleteShift(name)`, and `employeePortalPage.clockIn()`. | Tests read like user stories rather than DOM scripts. |
| **Pre-Authenticated Fixtures** | Updated `login-page.fixture.ts`, `admin-portal-page.fixture.ts`, and `employee-portal-page.fixture.ts` to automatically authenticate and navigate before yielding the page object. | Zero boilerplate setup inside `.spec.ts` test files. |
| **Smoke Tagging & Parallelism** | Tagged 4 critical path tests with `@smoke` and added parallel multi-worker execution (`npm run test:smoke:parallel`). | Enables sub-10-second health checks in CI before merging. |

---

## 🚀 4. How to Write a New Test (Step-by-Step Tutorial)

When a new feature or page is added to the application (e.g. a `/billing` page), follow this 3-step workflow:

### Step 1: Create or Update the Page Object (`tests/pom/`)
Create `tests/pom/BillingPage.ts` inheriting from `BasePage`:

```typescript
// tests/pom/BillingPage.ts
import { Page, Locator, APIRequestContext } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class BillingPage extends BasePage {
  readonly invoiceTable: Locator;
  readonly payInvoiceButton: Locator;

  constructor(page: Page, request?: APIRequestContext) {
    super(page, request);
    this.invoiceTable = page.locator("#invoice-table");
    this.payInvoiceButton = page.locator("button:has-text('Pay Invoice')");
  }

  // 📍 Define the route endpoint here:
  async navigate(): Promise<void> {
    await this.page.goto("/billing");
  }

  // 📍 Encapsulate high-level user actions:
  async payInvoice(invoiceId: string): Promise<void> {
    await this.page.locator(`tr[data-id="${invoiceId}"] button.pay`).click();
    await this.page.locator("button:has-text('Confirm Payment')").click();
  }
}
```

### Step 2: Create and Wire the Fixture (`fixtures/pages/`)
Create `fixtures/pages/billing-page.fixture.ts`:

```typescript
// fixtures/pages/billing-page.fixture.ts
import { test as base } from "@playwright/test";
import { BillingPage } from "../../tests/pom/BillingPage.js";
import { loginProgrammatic, getAdminCredentials } from "../../tests/helpers.js";

export type BillingPageDefinitions = {
  billingPage: BillingPage;
};

export const test = base.extend<BillingPageDefinitions>({
  billingPage: async ({ context, page, request }, use) => {
    // 1. Authenticate if required
    const creds = getAdminCredentials();
    await loginProgrammatic(context, request, creds.email, creds.password);

    // 2. Initialize and navigate
    const billingPage = new BillingPage(page, request);
    await billingPage.navigate();

    // 3. Inject ready-to-test instance
    await use(billingPage);
  },
});
```

Export your fixture in `fixtures/page-objects.fixture.ts`:
```typescript
import { test as billingPageTest } from "./pages/billing-page.fixture.js";

export const test = mergeTests(
  homePageTest,
  partnersPageTest,
  loginPageTest,
  adminPortalPageTest,
  employeePortalPageTest,
  privacyPageTest,
  billingPageTest // 👈 Add here
);
```

### Step 3: Write Your Declarative Spec File (`tests/pages/`)
Create `tests/pages/billing.spec.ts`:

```typescript
// tests/pages/billing.spec.ts
import { test, expect } from "../../fixtures/page-objects.fixture.js";

test.describe("Billing & Invoicing Portal Spec", () => {
  test("[Test_01] @smoke should render invoice history and allow payment", async ({ billingPage }) => {
    // Page is already authenticated and at /billing!
    await expect(billingPage.invoiceTable).toBeVisible();

    await billingPage.payInvoice("INV-1024");
    await expect(billingPage.invoiceTable.locator("text=Paid")).toBeVisible();
  });
});
```

---

## 🏷️ 5. Smoke Testing Guidelines

### Tagging Policy
- Tag critical-path, high-priority user journeys with `@smoke`.
- Keep the smoke test suite tight (**at least 1, but no more than 4-6 tests**) so that fast validation can execute in parallel under 15 seconds.

### Available Smoke Execution Scripts:
```bash
# Run all smoke tests with standard workers
npm run test:smoke

# Run all smoke tests in maximum parallel mode (4 workers)
npm run test:smoke:parallel
```

---

## 📚 6. Quick Reference: Where Routes & Configurations Live

| Page Object | File Location | Route |
| :--- | :--- | :--- |
| **Home** | `tests/pom/HomePage.ts` | `/` |
| **Partners** | `tests/pom/PartnersPage.ts` | `/partners` |
| **Login** | `tests/pom/LoginPage.ts` | `/login` |
| **Admin Portal** | `tests/pom/AdminPortalPage.ts` | `/admin` |
| **Employee Portal** | `tests/pom/EmployeePortalPage.ts` | `/dashboard` |
| **Privacy Policy** | `tests/pom/PrivacyPage.ts` | `/privacy` |
