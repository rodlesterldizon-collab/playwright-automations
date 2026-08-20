# Playwright Test Automation Framework

[![CI Status](https://img.shields.io/badge/CI%20Status-Passing-2ea44f?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Docker Image](https://img.shields.io/badge/Docker%20Image-mcr.microsoft.com%2Fplaywright-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://mcr.microsoft.com/v2/playwright/tags/list)

Comprehensive E2E and API test automation suite built with [Playwright](https://playwright.dev/) and TypeScript, implementing the Page Object Model (POM) design pattern with custom Fixtures injection, multi-viewport responsive testing, and CI/CD automated pipeline execution.

---

## 📚 Table of Contents

- [📁 Directory Structure & Directory Guide](#-directory-structure--directory-guide)
- [🏗️ Architecture & Design Pattern](#️-architecture--design-pattern)
  - [Fixture-Based Page Object Model (POM) Injection](#fixture-based-page-object-model-pom-injection)
  - [Efficiency & Maintenance Benefits of POM Fixtures](#efficiency--maintenance-benefits-of-pom-fixtures)
  - [Fixture Data Management & Separation (`/fixtures/`)](#fixture-data-management--separation-fixtures)
  - [Dynamic Payload Generation (`@faker-js/faker`)](#dynamic-payload-generation-faker-jsfaker)
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
│       └── playwright.yml          # GitHub Actions CI workflow definition
├── fixtures/                       # Fixtures & static JSON test payload data
│   ├── pages/                      # Individual Page Object Fixture modules
│   │   ├── admin-portal-page.fixture.ts    # Authenticated Admin Portal page fixture
│   │   ├── employee-portal-page.fixture.ts # Authenticated Caregiver Portal page fixture
│   │   ├── home-page.fixture.ts            # Homepage fixture with CMS setup
│   │   ├── login-page.fixture.ts           # Login page fixture
│   │   ├── partners-page.fixture.ts        # Partnerships page fixture with CMS setup
│   │   └── privacy-page.fixture.ts         # Privacy Policy page fixture
│   ├── cms.fixture.ts              # CMS data fixtures (navCms, homeCms, corporateCms, footerCms)
│   ├── page-objects.fixture.ts     # Master merged fixture uniting all POM & CMS fixtures
│   ├── adminData.json              # Admin employee & shift test templates
│   ├── authData.json               # Invalid user & rate limit payload test data
│   ├── homeData.json               # Homepage static content fallbacks
│   ├── partnersData.json           # Corporate partnership static content fallbacks
│   └── portalData.json             # Caregiver portal & leave request test templates
├── tests/
│   ├── api/                        # Backend API contract, schema & integration specs
│   │   ├── admin/                  # Admin user management & scheduling API specs
│   │   ├── auth/                   # Authentication, login & session API specs
│   │   ├── cms/                    # Content Delivery API & AJV contract/schema specs
│   │   ├── portal/                 # Caregiver shift & operational portal API specs
│   │   └── submissions/            # Consultation & partnership form submission API specs
│   ├── global/                     # Cross-page global layout component specs
│   │   ├── footer.spec.ts          # Footer link rendering, copyright & privacy routing
│   │   └── navbar.spec.ts          # Header navigation, brand logo & page routing
│   ├── pages/                      # Multi-viewport UI & E2E page specs
│   │   ├── admin-portal.spec.ts    # Admin dashboard & scheduling E2E specs
│   │   ├── employee-portal.spec.ts # Caregiver shift portal E2E specs
│   │   ├── homepage*.spec.ts       # Homepage specs (Desktop, Tablet, Mobile)
│   │   ├── login.spec.ts           # Login forms & IT support modal specs
│   │   └── partners*.spec.ts       # Partnership landing specs (Desktop, Tablet, Mobile)
│   ├── pom/                        # Page Object Model (POM) element locators & actions
│   │   ├── components/             # Reusable UI component models (Navbar, Footer)
│   │   ├── AdminPortalPage.ts      # Admin portal page object
│   │   ├── BasePage.ts             # Shared base page object with common utilities
│   │   ├── EmployeePortalPage.ts   # Employee portal page object
│   │   ├── HomePage.ts             # Landing homepage page object
│   │   ├── LoginPage.ts            # Login page object
│   │   ├── PartnersPage.ts         # Partnerships page object
│   │   └── PrivacyPage.ts          # Static privacy policy page object
│   └── helpers.ts                  # Shared test fixtures, CMS data fetchers & auth helpers
├── .env.test                       # Primary environment variables configuration
├── .env.tests                      # Secondary/CI environment variables configuration
├── playwright.config.ts            # Central Playwright configuration file
└── README.md                       # Framework documentation & execution guide
```

---

## 🏗️ Architecture & Design Pattern

The repository implements an advanced **Fixture-Based Page Object Model (POM)** architecture:

- **`tests/pom/`**: Encapsulates page element locators, section component handlers, and domain actions (`HomePage.ts`, `PartnersPage.ts`, `LoginPage.ts`, `AdminPortalPage.ts`, `EmployeePortalPage.ts`, `PrivacyPage.ts`).
- **`tests/pom/components/`**: Reusable navigation & footer component models (`Navbar.ts`, `Footer.ts`).
- **`fixtures/`**: Page-level fixture extensions (`fixtures/pages/*`) combined via `mergeTests` into a single central entry point (`/fixtures/page-objects.fixture.ts`).

### Fixture-Based Page Object Model (POM) Injection

Instead of manually instantiating page classes inside every test or relying on repetitive `beforeEach` / `beforeAll` hooks, page objects are injected directly into test parameter signatures as Playwright fixtures:

```ts
// Example: Using injected page objects and CMS fixtures
import { test, expect } from "../../fixtures/page-objects.fixture.js";

test("[Test_01] should render the hero section using CMS copy", async ({ homePage, homeCms }) => {
  await expect(homePage.hero.getBadgeText(homeCms.hero.badge)).toBeVisible();
});

test("[Test_01] should support staff registry auditing", async ({ adminPortalPage }) => {
  await adminPortalPage.registry.registryTab.click();
  await expect(adminPortalPage.registry.getEmployeeName("Elena Rodriguez")).toBeVisible();
});
```

### Efficiency & Maintenance Benefits of POM Fixtures

1. **Elimination of Boilerplate**: Removes manual instantiation (`new HomePage(page, request)`) and repetitive `beforeEach` setup blocks from test files.
2. **Lazy On-Demand Initialization**: Fixtures execute **only** when requested by a test method signature. Unused fixtures are never loaded or executed, reducing memory overhead and improving test execution speed.
3. **Encapsulated Authentication**: Authenticated page fixtures (`adminPortalPage`, `employeePortalPage`) automatically handle programmatic authentication via `.env.test` / `.env.tests` credentials prior to test execution, keeping spec files completely clean.
4. **Modular & Scalable Architecture**: Individual page fixtures in `/fixtures/pages/` are combined using Playwright's `mergeTests` utility into `/fixtures/page-objects.fixture.ts`, enabling a clean, single-point import across all spec files.
5. **Simplified Test Maintenance**: Updates to setup workflows, route preparation, or authentication mechanisms only require changes in the corresponding fixture file without touching any spec files.

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

Rather than asserting against hardcoded static strings, tests dynamically retrieve page copy, navigation links, and section configurations directly from the CMS Content Delivery API using `cms.fixture.ts` and `fetchCmsContent` in [`tests/helpers.ts`](file:///Users/vimay/playwright-test-automation/tests/helpers.ts#L84-L95):

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

Every test across all spec files is tagged with a standardized ID prefix (`[Test_01]`, `[Test_02]`, etc.) for test reporting and traceability.

---

## 🧪 Test Coverage

### 1. Global Navigation (`tests/global/`)
- `navbar.spec.ts` (`[Test_01]` – `[Test_07]`): Desktop & mobile drawer navigation, brand logo links, portal routing using `homePage`, `partnersPage`, `loginPage`, `privacyPage`, and `navCms` fixtures.
- `footer.spec.ts` (`[Test_01]` – `[Test_10]`): Dynamic CMS link rendering, privacy policy routing, copyright notice using `homePage` and `footerCms` fixtures.

### 2. Page-Level E2E (`tests/pages/`)
- **Desktop Layouts**: `homepage.spec.ts` and `partners.spec.ts` test standard large desktop layouts.
- **Tablet Layouts (`768x1024`)**: `homepage.tablet.spec.ts` and `partners.tablet.spec.ts` run targeting simulated tablet devices to verify layout wrapping, column shifts, and touch-friendly targets.
- **Mobile Layouts (`375x812`)**: `homepage.mobile.spec.ts` and `partners.mobile.spec.ts` run targeting mobile phones (e.g. iPhone X size) to verify collapsed hamburger menus, stacked elements, and compressed CTAs.
- `admin-portal.spec.ts` (`[Test_01]` – `[Test_04]`): Admin login, dashboard navigation, user role management, system metrics view using `adminPortalPage` fixture.
- `employee-portal.spec.ts` (`[Test_01]` – `[Test_04]`): Staff schedule view, patient assignment lists, shift check-in/out using `employeePortalPage` fixture.
- `login.spec.ts` (`[Test_01]` – `[Test_04]`): Login forms, password reset dialogs, IT support request slide-down form using `loginPage` fixture.

### 3. API Testing (`tests/api/`)
- `api/cms/` (`[Test_01]` – `[Test_22]`): CMS Content Delivery API payload validation (`content.spec.ts`) and AJV schema compliance with latency SLAs (`content.schema.spec.ts`).
- `api/auth/` (`[Test_01]` – `[Test_04]`): Login endpoints, token exchange, authorization headers, 401/403 error handling (`auth.spec.ts`).
- `api/admin/` (`[Test_01]` – `[Test_03]`): Admin user management endpoints, metrics calculation APIs, system health checks (`admin.spec.ts`).
- `api/portal/` (`[Test_01]` – `[Test_08]`): Shift management endpoints, patient profile lookup, caregiver task updates (`portal.spec.ts`).
- `api/submissions/` (`[Test_01]` – `[Test_06]`): Public consultation requests and corporate inquiry form API endpoints (`form-submission.spec.ts`).

---

## ⏸️ Skipped Tests Note (104 Active / 22 Skipped)

The 22 skipped scenarios (such as stateful CRUD operations and Gmail/OAuth-based authentication endpoints) are fully implemented, passing tests that are intentionally bypassed in this public repository. This deliberate configuration prevents triggering third-party automated login security blocks, captcha challenges, and 429 rate limits inherent to repeated unmocked testing against a personal free-tier environment.

---

## 🏗️ Architecture Scope & Enterprise Roadmap

This test suite is designed as a **clean, modular demonstration framework** showcasing core automation patterns—Page Object Model (POM), multi-viewport matrix testing, AJV JSON schema contract validation, and GitHub Actions CI pipelines—optimized to run reliably in free-tier container environments without infrastructure costs.

### Enterprise Scaling Roadmap
In a full enterprise production test organization, this foundation easily extends to include:
- **Ephemeral Test Environments & Data Teardown**: Dynamic database seeding and lifecycle hooks (`test.afterAll`) for zero-pollution stateful testing.
- **Distributed CI Sharding**: Parallel multi-node test distribution (`--shard=1/4`) with automated flakiness quarantining.
- **Synthetic Monitoring**: Scheduled production smoke suites and latency SLAs integrated with alerting (Slack/PagerDuty).
- **Identity & Vault Integration**: Dedicated staging OAuth service accounts and automated secret rotation.

---

## 📱 Viewport Compatibility Testing System

To guarantee absolute consistency and prevent state pollution, viewport-specific tests are decoupled from manual inline viewport overrides (`page.setViewportSize`) and managed dynamically through native **Playwright Projects** in `playwright.config.ts`:

1. **`chromium` (Desktop)**: Runs general pages with default high-resolution viewport settings while ignoring viewport-specific specs (`testIgnore: ["**/*.mobile.spec.ts", "**/*.tablet.spec.ts"]`).
2. **`tablet` (Tablet)**: Matches `**/*.tablet.spec.ts` and overrides the default viewport size to `768x1024` with standard chromium rendering.
3. **`mobile` (Mobile)**: Matches `**/*.mobile.spec.ts` and overrides the default viewport size to `375x812` with standard chromium rendering.

This clean separation ensures high execution speed, parallelizability, and isolated environment capabilities.

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
| **Smoke Tests** | `npm run test:smoke` | Run critical path smoke tests (`@smoke`) |
| **Smoke Tests (Parallel)** | `npm run test:smoke:parallel` | Run smoke tests concurrently across 4 workers |
| **UI Mode** | `npx playwright test --ui` | Open interactive Playwright UI runner |
| **Mobile Tests** | `npx playwright test --project=mobile` | Run all mobile viewport UI page specs (`375x812`) |
| **Tablet Tests** | `npx playwright test --project=tablet` | Run all tablet viewport UI page specs (`768x1024`) |
| **Desktop Tests** | `npx playwright test --project=chromium` | Run all standard desktop E2E UI page specs |
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

## 🔄 CI/CD Pipelines & Docker Container Optimizations

The repository provides two automated GitHub Actions workflows:

### 1. Full E2E & API Suite (`.github/workflows/playwright.yml`)
- Executes the full testing matrix (Desktop, Mobile, Tablet, CMS API, Submissions, Auth).
- Triggers on push & pull request to `main`/`master`.

### 2. Dedicated Fast Smoke Pipeline (`.github/workflows/playwright-smoke.yml`)
- Executes **only tests tagged with `@smoke`** in parallel across 4 workers (`npm run test:smoke:parallel`).
- Provides sub-minute rapid health checks on PRs, pushes, and manual `workflow_dispatch` triggers.
- Publishes isolated `playwright-smoke-report` artifacts.

### Container & Infrastructure Decisions:
- **Custom Enterprise GHCR Docker Image**: Runs inside `ghcr.io/rodlesterldizon-collab/core-test-suite/test-runner:v1.50.1` with pre-installed browser binaries (Noble LTS / Playwright v1.50.1) and non-root execution support.
- **Fast Execution Optimization**: `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` prevents redundant browser binary downloads during dependency installation, saving 1–2 minutes per run.
- **`npm install` vs. `npm ci` Architecture Decision**: 
  - The pipeline intentionally uses `npm install` rather than `npm ci` because CI runs inside the pre-baked Ubuntu Jammy Linux container (`mcr.microsoft.com/playwright:v1.62.1-jammy`). 
  - When contributors work across macOS (Apple Silicon ARM64) and Windows, `package-lock.json` records host-specific optional binary trees (such as `esbuild` or `rollup`). Running `npm ci` inside a Linux container strictly enforces exact lockfile platform hashes and can fail with platform architecture mismatch errors (`EUSAGE`/`ETARGET`).
  - `npm install` dynamically resolves the required Linux `x64` binaries inside the container while preserving caching via `actions/cache@v4`.
  - *Standard Host VM Alternative*: If switching from the pre-baked container to a standard `ubuntu-latest` runner (where `npx playwright install --with-deps` is executed per run), `npm ci` can be cleanly re-enabled.
- **Graceful Secret Degradation for Public PRs**: The workflow provides fallback defaults for tokens so public forks and unauthenticated PRs can still run the entire public UI, viewport matrix, and schema validation test suites without failing immediately on missing staging credentials. In private enterprise repositories, strict entry-level secret validation can be enforced.
- **Dependency Caching**: Utilizes `actions/cache@v4` on `~/.npm` keyed against `package-lock.json` for rapid step execution.
- **Secrets & Environment Integration**: Consumes GitHub Secrets (`PLAYWRIGHT_BASE_URL`, `CONTENT_API_BASE_URL`, `SPACE_ID`, `ACCESS_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.).
- **Artifact Generation**: Automatically uploads interactive HTML Playwright execution report artifacts retained for 30 days (14 days for smoke).
