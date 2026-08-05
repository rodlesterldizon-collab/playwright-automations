# Playwright Test Automation Framework

Comprehensive E2E and API test automation suite built with [Playwright](https://playwright.dev/) and TypeScript, implementing the Page Object Model (POM) design pattern, multi-viewport responsive testing, and CI/CD automated pipeline execution.

---

## 📚 Table of Contents

- [📁 Directory Structure & Directory Guide](#-directory-structure--directory-guide)
- [🏗️ Architecture & Design Pattern](#️-architecture--design-pattern)
  - [Dynamic CMS Content Integration (`fetchCmsContent`)](#dynamic-cms-content-integration-fetchcmscontent)
- [🧪 Test Coverage](#-test-coverage)
  - [1. Global Navigation (`tests/global/`)](#1-global-navigation-testsglobal)
  - [2. Page-Level E2E (`tests/pages/`)](#2-page-level-e2e-testspages)
  - [3. API Testing (`tests/api/`)](#3-api-testing-testsapi)
- [⚙️ Configuration & Setup](#%EF%B8%8F-configuration--setup)
- [🚀 Directory-Specific Execution Commands](#-directory-specific-execution-commands)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)

---

## 📁 Directory Structure & Directory Guide

```
playwright-test-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI workflow definition
├── fixtures/                     # Static & template JSON test payload fixtures
│   ├── adminData.json            # Admin employee & shift test templates
│   ├── authData.json             # Invalid user & rate limit payload test data
│   ├── homeData.json             # Homepage static content fallbacks
│   ├── partnersData.json         # Corporate partnership static content fallbacks
│   └── portalData.json           # Caregiver portal & leave request test templates
├── tests/
│   ├── api/                      # Backend API contract, schema & integration specs
│   │   ├── admin/                # Admin user management & scheduling API specs
│   │   ├── auth/                 # Authentication, login & session API specs
│   │   ├── cms/                  # Content Delivery API & AJV contract/schema specs
│   │   ├── portal/               # Caregiver shift & operational portal API specs
│   │   └── submissions/          # Consultation & partnership form submission API specs
│   ├── global/                   # Cross-page global layout component specs
│   │   ├── footer.spec.ts        # Footer link rendering, copyright & privacy routing
│   │   └── navbar.spec.ts        # Header navigation, brand logo & page routing
│   ├── pages/                    # Multi-viewport UI & E2E page specs
│   │   ├── admin-portal.spec.ts  # Admin dashboard & scheduling E2E specs
│   │   ├── employee-portal.spec.ts # Caregiver shift portal E2E specs
│   │   ├── homepage*.spec.ts     # Homepage specs (Desktop, Tablet, Mobile)
│   │   ├── login.spec.ts         # Login forms & IT support modal specs
│   │   └── partners*.spec.ts     # Partnership landing specs (Desktop, Tablet, Mobile)
│   ├── pom/                      # Page Object Model (POM) element locators & actions
│   │   ├── components/           # Reusable UI component models (Navbar, Footer)
│   │   ├── AdminPortalPage.ts    # Admin portal page object
│   │   ├── BasePage.ts           # Shared base page object with common utilities
│   │   ├── EmployeePortalPage.ts # Employee portal page object
│   │   ├── HomePage.ts           # Landing homepage page object
│   │   ├── LoginPage.ts          # Login page object
│   │   ├── PartnersPage.ts       # Partnerships page object
│   │   └── PrivacyPage.ts        # Static privacy policy page object
│   └── helpers.ts                # Shared test fixtures, CMS data fetchers & auth helpers
├── .env.test                     # Primary environment variables configuration
├── .env.tests                    # Secondary/CI environment variables configuration
├── playwright.config.ts          # Central Playwright configuration file
└── README.md                     # Framework documentation & execution guide
```

---

## 🏗️ Architecture & Design Pattern

The repository follows a clean **Page Object Model (POM)** architecture:

- **`tests/pom/`**: Encapsulates page elements and methods (`HomePage.ts`, `PartnersPage.ts`, `LoginPage.ts`, `AdminPortalPage.ts`, `EmployeePortalPage.ts`, `PrivacyPage.ts`).
- **`tests/pom/components/`**: Reusable navigation & footer component models (`Navbar.ts`, `Footer.ts`).
### Fixture Data Management & Separation (`/fixtures/`)

To prevent inline hardcoded test data and maintain clean spec files, static data templates and mock payload structures are stored in central JSON files within `/fixtures/`:
- **`homeData.json` / `partnersData.json`**: CMS fallback data structures.
- **`adminData.json`**: Base shift, employee creation, and leave approval payload templates.
- **`authData.json`**: Invalid credentials and rate limiting payload data.
- **`portalData.json`**: Caregiver operational leave request and unauthorized action payload templates.

### Dynamic Payload Generation (`@faker-js/faker`)

For realistic data generation and to prevent collision during concurrent test runs, the framework utilizes `@faker-js/faker`:
- **Dynamic Form Submissions**: Generates realistic names, emails, phone numbers, and company names for care consultations and partnership inquiries (`helpers.ts`).
- **Dynamic Entities**: Generates unique alphanumeric IDs and randomized email addresses for mock employee creation, shift IDs, and leave request identifiers in API specs (`admin.spec.ts`, `portal.spec.ts`).

> ⚠️ **Authentication Rule**: `@faker-js/faker` is strictly reserved for dynamic mock payload generation. Actual test authentication in portal specs (`admin-portal.spec.ts`, `employee-portal.spec.ts`, `login.spec.ts`) and API authentication tests MUST NOT use faker, but instead consume valid environment credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `EMPLOYEE_EMAIL`, `EMPLOYEE_PASSWORD`) sourced from `.env.test` / `.env.tests`.

### Dynamic CMS Content Integration (`fetchCmsContent`)

Rather than asserting against hardcoded static strings, tests dynamically retrieve page copy, navigation links, and section configurations directly from the CMS Content Delivery API using `fetchCmsContent` in [`tests/helpers.ts`](file:///Users/vimay/playwright-test-automation/tests/helpers.ts#L84-L95):

```ts
export async function fetchCmsContent(request: APIRequestContext, pageId: string): Promise<CmsContent> {
  const apiBase = process.env.CONTENT_API_BASE_URL || "https://compassion-care.ai.studio/api/content";
  const spaceId = process.env.SPACE_ID || "ccspace_ID";
  const token = process.env.ACCESS_TOKEN || "cc_cda_token_number";

  const response = await request.get(`${apiBase}/${spaceId}/${pageId}?access_token=${token}`);
  if (!response.ok()) {
    throw new Error(`Failed to fetch CMS content for ${pageId}: ${response.statusText()}`);
  }
  const body = await response.json();
  return body.content;
}
```

This helper is invoked in fixture extensions and `beforeEach` setup calls (`setupCmsPage`) so that UI assertions automatically validate against the latest CMS data.

Every test across all spec files is tagged with a standardized ID prefix (`[Test_01]`, `[Test_02]`, etc.) for test reporting and traceability.

---

## 🧪 Test Coverage

### 1. Global Navigation (`tests/global/`)
- `navbar.spec.ts` (`[Test_01]` – `[Test_07]`): Desktop & mobile drawer navigation, brand logo links, portal routing.
- `footer.spec.ts` (`[Test_01]` – `[Test_10]`): Dynamic CMS link rendering, privacy policy routing, copyright notice.

### 2. Page-Level E2E (`tests/pages/`)
- `homepage*.spec.ts` (`[Test_01]` – `[Test_06]`): Desktop, Tablet (`768x1024`), and Mobile (`375x812`) viewport layouts, hero CTAs, service cards, contact forms.
- `partners*.spec.ts` (`[Test_01]` – `[Test_08]`): Desktop, Tablet, and Mobile viewport layouts, corporate intake forms, interactive ROI calculators, testimonial carousels.
- `admin-portal.spec.ts` (`[Test_01]` – `[Test_04]`): Admin login, dashboard navigation, user role management, system metrics view.
- `employee-portal.spec.ts` (`[Test_01]` – `[Test_04]`): Staff schedule view, patient assignment lists, shift check-in/out.
- `login.spec.ts` (`[Test_01]` – `[Test_04]`): Login forms, password reset dialogs, IT support request slide-down form.

### 3. API Testing (`tests/api/`)
- `api/cms/` (`[Test_01]` – `[Test_22]`): CMS Content Delivery API payload validation (`content.spec.ts`) and AJV schema compliance with latency SLAs (`content.schema.spec.ts`).
- `api/auth/` (`[Test_01]` – `[Test_04]`): Login endpoints, token exchange, authorization headers, 401/403 error handling (`auth.spec.ts`).
- `api/admin/` (`[Test_01]` – `[Test_03]`): Admin user management endpoints, metrics calculation APIs, system health checks (`admin.spec.ts`).
- `api/portal/` (`[Test_01]` – `[Test_08]`): Shift management endpoints, patient profile lookup, caregiver task updates (`portal.spec.ts`).
- `api/submissions/` (`[Test_01]` – `[Test_06]`): Public consultation requests and corporate inquiry form API endpoints (`form-submission.spec.ts`).

---

## ⚙️ Configuration & Setup

Environment settings are loaded via `.env.tests` (or GitHub Secrets in CI):

```bash
PLAYWRIGHT_baseUrl="https://compassion-care.ai.studio/"
CONTENT_API_BASE_URL="https://compassion-care.ai.studio/api/content"
SPACE_ID="ccspace_ID"
ACCESS_TOKEN="cc_cda_token_number"
```

---

## 🚀 Directory-Specific Execution Commands

Run test suites targeted by specific directories or layers:

| Target Scope | Command | Description |
| :--- | :--- | :--- |
| **All Tests** | `npx playwright test` | Run entire E2E and API test suite |
| **UI Mode** | `npx playwright test --ui` | Open interactive Playwright UI runner |
| **Global Components** | `npx playwright test tests/global/` | Run Navbar & Footer component specs |
| **Page E2E Tests** | `npx playwright test tests/pages/` | Run all desktop, tablet, and mobile UI page specs |
| **API Test Suite** | `npx playwright test tests/api/` | Run all backend API test directories |
| **API — CMS Only** | `npx playwright test tests/api/cms/` | Run CMS content & AJV contract schema specs |
| **API — Auth Only** | `npx playwright test tests/api/auth/` | Run authentication & session specs |
| **API — Admin Only** | `npx playwright test tests/api/admin/` | Run admin control API specs |
| **API — Portal Only** | `npx playwright test tests/api/portal/` | Run caregiver portal operational specs |
| **API — Submissions** | `npx playwright test tests/api/submissions/` | Run form submission validation specs |
| **HTML Report** | `npx playwright show-report` | Open the generated HTML execution report |

---

## 🔄 CI/CD Pipeline

Automated workflow (`.github/workflows/playwright.yml`):
- Runs automatically on `push` and `pull_request` to `main`/`master` branches.
- Uses official Microsoft Playwright Docker container (`mcr.microsoft.com/playwright:v1.62.1-jammy`).
- Consumes environment secrets (`PLAYWRIGHT_BASE_URL`, `CONTENT_API_BASE_URL`, `SPACE_ID`, `ACCESS_TOKEN`, etc.).
- Generates and uploads Playwright HTML report artifact retained for 30 days.
