import { test, expect } from "@playwright/test";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

// ─── AJV Schemas ──────────────────────────────────────────────────────────────

const homeFormSchema = {
  type: "object",
  required: ["labels", "placeholders", "cta", "successMessage"],
  properties: {
    labels: {
      type: "object",
      required: ["name", "email", "phone", "typeOfCare", "helpDescription"],
      properties: {
        name: { type: "string", minLength: 1 },
        email: { type: "string", minLength: 1 },
        phone: { type: "string", minLength: 1 },
        typeOfCare: { type: "string", minLength: 1 },
        helpDescription: { type: "string", minLength: 1 }
      },
      additionalProperties: false
    },
    placeholders: {
      type: "object",
      required: ["name", "email", "phone", "helpDescription"],
      properties: {
        name: { type: "string", minLength: 1 },
        email: { type: "string", minLength: 1 },
        phone: { type: "string", minLength: 1 },
        helpDescription: { type: "string", minLength: 1 }
      },
      additionalProperties: false
    },
    cta: { type: "string", minLength: 1 },
    successMessage: {
      type: "object",
      required: ["title", "description"],
      properties: {
        title: { type: "string", minLength: 1 },
        description: { type: "string", minLength: 1 }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};

const corporateInquiryFormSchema = {
  type: "object",
  required: [
    "name",
    "email",
    "orgType",
    "comments",
    "placeholderName",
    "placeholderEmail",
    "placeholderComments"
  ],
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", minLength: 1 },
    orgType: { type: "string", minLength: 1 },
    comments: { type: "string", minLength: 1 },
    placeholderName: { type: "string", minLength: 1 },
    placeholderEmail: { type: "string", minLength: 1 },
    placeholderComments: { type: "string", minLength: 1 }
  },
  additionalProperties: false
};

test.describe("CMS Content Delivery API Schema & Contract Spec (AJV)", () => {
  const getCmsUrl = (pageId: string, token?: string) => {
    const base = process.env.CONTENT_API_BASE_URL || "https://compassion-care.ai.studio/api/content";
    const spaceId = process.env.SPACE_ID || "ccspace_ID";
    const t = token ?? process.env.ACCESS_TOKEN ?? "cc_cda_token_number";
    return `${base}/${spaceId}/${pageId}?access_token=${t}`;
  };

  // ─── Home Endpoint ─────────────────────────────────────────────────────────────

  test.describe("CMS API — Home Page Schema & Contract", () => {
    let response: any;
    let body: any;
    let duration: number;

    test.beforeAll(async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      const startTime = Date.now();
      response = await requestContext.get(getCmsUrl("home"));
      duration = Date.now() - startTime;
      body = response.ok() ? await response.json() : null;
      await requestContext.dispose();
    });

    test("[Test_01] should return HTTP 200", () => {
      expect(response.status()).toBe(200);
    });

    test("[Test_02] should respond within 5 seconds", () => {
      expect(duration).toBeLessThan(5000);
    });

    test("[Test_03] should respond with Content-Type: application/json", () => {
      const contentType = response.headers()["content-type"] || "";
      expect(contentType).toMatch(/application\/json/);
    });

    test("[Test_04] should return 401 or 403 when access_token is missing", async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      const base = process.env.CONTENT_API_BASE_URL || "https://compassion-care.ai.studio/api/content";
      const spaceId = process.env.SPACE_ID || "ccspace_ID";
      const r = await requestContext.get(`${base}/${spaceId}/home`);
      expect([401, 403]).toContain(r.status());
      await requestContext.dispose();
    });

    test("[Test_05] should return 401 or 403 when access_token is invalid", async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      const r = await requestContext.get(getCmsUrl("home", "invalid_token_xyz"));
      expect([401, 403]).toContain(r.status());
      await requestContext.dispose();
    });

    test("[Test_06] should return 404 for an unknown page ID", async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      const r = await requestContext.get(getCmsUrl("does_not_exist"));
      expect(r.status()).toBe(404);
      await requestContext.dispose();
    });

    test("[Test_07] should have a valid ISO 8601 updatedAt timestamp in sys", () => {
      const date = new Date(body.sys.updatedAt);
      expect(date.toString()).not.toBe("Invalid Date");
    });

    test("[Test_08] should verify all top-level content sections have visible as a boolean", () => {
      const { hero, stats, about, services, contact } = body.content;
      for (const section of [hero, stats, about, services, contact]) {
        expect(typeof section.visible).toBe("boolean");
      }
    });

    test("[Test_09] should verify each service item href starts with #", () => {
      for (const item of body.content.services.items) {
        expect(item.href).toMatch(/^#/);
      }
    });

    test("[Test_10] should match content.contact.form against the AJV form field schema", () => {
      const form = body.content.contact.form;
      const valid = ajv.validate(homeFormSchema, form);
      expect(valid).toBe(true);
    });
  });

  // ─── Corporate Endpoint ────────────────────────────────────────────────────────

  test.describe("CMS API — Corporate Page Schema & Contract", () => {
    let response: any;
    let body: any;
    let duration: number;

    test.beforeAll(async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      const startTime = Date.now();
      response = await requestContext.get(getCmsUrl("corporate"));
      duration = Date.now() - startTime;
      body = response.ok() ? await response.json() : null;
      await requestContext.dispose();
    });

    test("[Test_11] should return HTTP 200", () => {
      expect(response.status()).toBe(200);
    });

    test("[Test_12] should respond within 5 seconds", () => {
      expect(duration).toBeLessThan(5000);
    });

    test("[Test_13] should respond with Content-Type: application/json", () => {
      const contentType = response.headers()["content-type"] || "";
      expect(contentType).toMatch(/application\/json/);
    });

    test("[Test_14] should return 401 or 403 when access_token is invalid", async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      const r = await requestContext.get(getCmsUrl("corporate", "bad_token"));
      expect([401, 403]).toContain(r.status());
      await requestContext.dispose();
    });

    test("[Test_15] should have a valid ISO 8601 updatedAt timestamp in sys", () => {
      const date = new Date(body.sys.updatedAt);
      expect(date.toString()).not.toBe("Invalid Date");
    });

    test("[Test_16] should verify all top-level content sections have visible as a boolean", () => {
      const { navigation, hero, howItWorks, features, calculator, testimonial, inquiry, contact } = body.content;
      for (const section of [navigation, hero, howItWorks, features, calculator, testimonial, inquiry, contact]) {
        expect(typeof section.visible).toBe("boolean");
      }
    });

    test("[Test_17] should verify hero CTA hrefs start with #", () => {
      const { hero } = body.content;
      expect(hero.ctaHref).toMatch(/^#/);
      expect(hero.ctaSecondaryHref).toMatch(/^#/);
    });

    test("[Test_18] should verify howItWorks link href starts with #", () => {
      expect(body.content.howItWorks.link.href).toMatch(/^#/);
    });

    test("[Test_19] should verify calculator has exactly 3 care level options", () => {
      expect(body.content.calculator.labels.careLevels).toHaveLength(3);
    });

    test("[Test_20] should verify onDemandStaffing highlights is an array of non-empty strings", () => {
      const highlights = body.content.features.onDemandStaffing.highlights;
      expect(Array.isArray(highlights)).toBe(true);
      expect(highlights.length).toBeGreaterThan(0);
      for (const h of highlights) {
        expect(typeof h).toBe("string");
        expect(h.length).toBeGreaterThan(0);
      }
    });

    test("[Test_21] should verify certifiedProfessionals list is an array of non-empty strings", () => {
      const list = body.content.features.certifiedProfessionals.list;
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
      for (const item of list) {
        expect(typeof item).toBe("string");
        expect(item.length).toBeGreaterThan(0);
      }
    });

    test("[Test_22] should match content.inquiry.fields against the AJV inquiry form field schema", () => {
      const fields = body.content.inquiry.fields;
      const valid = ajv.validate(corporateInquiryFormSchema, fields);
      expect(valid).toBe(true);
    });
  });
});
