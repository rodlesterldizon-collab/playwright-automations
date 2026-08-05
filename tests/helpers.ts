import { Page, APIRequestContext, BrowserContext } from "@playwright/test";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CmsContent {
  [key: string]: any;
}

/**
 * Robust JSON fixture loaders to bypass ES Module import assertion restrictions
 */
export function getHomeData() {
  const filePath = path.resolve(__dirname, "../fixtures/homeData.json");
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function getPartnersData() {
  const filePath = path.resolve(__dirname, "../fixtures/partnersData.json");
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function getAdminData() {
  const filePath = path.resolve(__dirname, "../fixtures/adminData.json");
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function getAuthData() {
  const filePath = path.resolve(__dirname, "../fixtures/authData.json");
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function getPortalData() {
  const filePath = path.resolve(__dirname, "../fixtures/portalData.json");
  return JSON.parse(readFileSync(filePath, "utf8"));
}

/**
 * Shared credentials helper reading from environment variables
 */
export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin";
  return { email, password };
}

export function getCaregiverCredentials() {
  const email = process.env.EMPLOYEE_EMAIL || "employee@example.com";
  const password = process.env.EMPLOYEE_PASSWORD || "admin";
  return { email, password };
}

/**
 * Generates a dynamic random consultation request payload for API testing
 */
export function generateMockConsultation() {
  return {
    id: `consultation-${faker.string.alphanumeric(7)}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    typeOfCare: "In-Home Care",
    helpDescription: faker.lorem.sentence(),
    timestamp: new Date().toISOString()
  };
}

/**
 * Generates a dynamic random partnership inquiry payload
 */
export function generateMockPartnership() {
  return {
    id: `partnership-${faker.string.alphanumeric(7)}`,
    name: faker.company.name(),
    email: faker.internet.email(),
    orgType: "Retirement Home",
    needs: faker.lorem.sentence(),
    timestamp: new Date().toISOString()
  };
}

/**
 * Generates formatted date math helper (e.g. today, tomorrow)
 */
export function getFutureDateString(daysAhead = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

/**
 * Formats a raw date to a readable standard caregiver label (e.g. "MON 11")
 */
export function formatDateToLabel(dateString: string): string {
  const date = new Date(dateString);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayName = days[date.getDay()];
  const dayOfMonth = date.getDate();
  return `${dayName} ${dayOfMonth}`;
}

/**
 * Fetches content directly from the CMS Content Delivery API for a given page ID.
 * Returns the `content` data object.
 *
 * @param {APIRequestContext} request - Playwright API request context
 * @param {string} pageId - Target page ID (e.g., 'home', 'corporate')
 */
export async function fetchCmsContent(request: APIRequestContext, pageId: string): Promise<CmsContent> {
  const apiBase = process.env.CONTENT_API_BASE_URL || "https://compassion-care.ai.studio/api/content";
  const spaceId = process.env.SPACE_ID || "ccspace_8a39b2";
  const token = process.env.ACCESS_TOKEN || "cc_cda_token_9e4f21";

  const response = await request.get(`${apiBase}/${spaceId}/${pageId}?access_token=${token}`);
  if (!response.ok()) {
    throw new Error(`Failed to fetch CMS content for ${pageId}: ${response.statusText()}`);
  }
  const body = await response.json();
  return body.content;
}

/**
 * Helper to fetch CMS page data and visit the target route in one call.
 * Returns the CMS page content so tests can assign it locally.
 *
 * @param {Page} page - Playwright browser page
 * @param {APIRequestContext} request - Playwright API request context
 * @param {string} pageId - Target page ID (e.g., 'home', 'corporate')
 * @param {string} route - Target UI route (e.g., '/', '/partners')
 */
export async function setupCmsPage(page: Page, request: APIRequestContext, pageId: string, route: string = "/"): Promise<CmsContent> {
  const content = await fetchCmsContent(request, pageId);
  await page.goto(route);
  return content;
}

/**
 * Programmatic login utilizing Playwright context state to establish and cache session state.
 * Bypasses the UI login page to speed up test execution.
 */
export async function loginProgrammatic(context: BrowserContext, request: APIRequestContext, email: string, loginPass: string): Promise<void> {
  const baseUrl = process.env.PLAYWRIGHT_baseUrl || process.env.PLAYWRIGHT_BASE_URL || "https://compassion-care.ai.studio/";

  const response = await request.post(`${baseUrl}api/auth/login`, {
    data: { email, password: loginPass },
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok()) {
    throw new Error(`Programmatic login failed: ${response.statusText()}`);
  }

  const body = await response.json();
  if (!body.success) {
    throw new Error(`Programmatic login rejected: ${JSON.stringify(body)}`);
  }

  // Ensure cookies from request context are transfered/accessible in page context.
  // Playwright automatically shares cookie state if request context is context.request!
}
