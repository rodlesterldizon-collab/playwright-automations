import { test, expect } from "@playwright/test";

test.describe("CMS Content Delivery API Contract Spec", () => {
  const getCmsUrl = (pageId: string, token?: string) => {
    const base = process.env.CONTENT_API_BASE_URL || "https://compassion-care.ai.studio/api/content";
    const spaceId = process.env.SPACE_ID || "ccspace_ID";
    const t = token ?? process.env.ACCESS_TOKEN ?? "cc_cda_token_number";
    return `${base}/${spaceId}/${pageId}?access_token=${t}`;
  };

  // ─── Home Page Endpoint ────────────────────────────────────────────────────────

  test.describe("GET /api/content/{spaceId}/home", () => {
    let response: any;
    let body: any;

    test.beforeAll(async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      response = await requestContext.get(getCmsUrl("home"));
      body = response.ok() ? await response.json() : null;
      await requestContext.dispose();
    });

    test("[Test_01] should return HTTP 200", () => {
      expect(response.status()).toBe(200);
    });

    test("[Test_02] should return a non-empty JSON body", () => {
      expect(body).toBeInstanceOf(Object);
      expect(Object.keys(body).length).toBeGreaterThan(0);
    });

    test("[Test_03] should include a sys block with correct space and page ID", () => {
      const spaceId = process.env.SPACE_ID || "ccspace_ID";
      expect(body.sys).toMatchObject({
        id: "home",
        space: spaceId,
        type: "PageContent"
      });
    });

    test("[Test_04] should include a content block with all top-level sections", () => {
      const sections = ["hero", "stats", "about", "services", "contact"];
      for (const key of sections) {
        expect(body.content).toHaveProperty(key);
      }
    });

    test("[Test_05] should return the correct hero badge text", () => {
      expect(typeof body.content.hero.badge).toBe("string");
      expect(body.content.hero.badge.length).toBeGreaterThan(0);
    });

    test("[Test_06] should return the correct services section title", () => {
      expect(body.content.services.title).toBe("Care Tailored to Your Needs");
    });

    test("[Test_07] should return the correct about section title", () => {
      expect(body.content.about.title).toBe("Our Mission & Heartfelt Story");
    });

    test("[Test_08] should return the correct contact section title", () => {
      expect(body.content.contact.form.cta).toBe("Request Consultation");
    });

    test("[Test_09] should return 4 service items", () => {
      expect(body.content.services.items).toHaveLength(4);
    });

    test("[Test_10] should return 4 stats items", () => {
      expect(body.content.stats.items).toHaveLength(4);
    });

    test("[Test_11] should return 4 about feature items", () => {
      expect(body.content.about.features).toHaveLength(4);
    });
  });

  // ─── Corporate (Partners) Page Endpoint ───────────────────────────────────────

  test.describe("GET /api/content/{spaceId}/corporate", () => {
    let response: any;
    let body: any;

    test.beforeAll(async ({ playwright }) => {
      const requestContext = await playwright.request.newContext();
      response = await requestContext.get(getCmsUrl("corporate"));
      body = response.ok() ? await response.json() : null;
      await requestContext.dispose();
    });

    test("[Test_12] should return HTTP 200", () => {
      expect(response.status()).toBe(200);
    });

    test("[Test_13] should return a non-empty JSON body", () => {
      expect(body).toBeInstanceOf(Object);
      expect(Object.keys(body).length).toBeGreaterThan(0);
    });

    test("[Test_14] should include a sys block with correct space and page ID", () => {
      const spaceId = process.env.SPACE_ID || "ccspace_ID";
      expect(body.sys).toMatchObject({
        id: "corporate",
        space: spaceId,
        type: "PageContent"
      });
    });

    test("[Test_15] should include a content block with all top-level sections", () => {
      const sections = ["navigation", "hero", "howItWorks", "features", "calculator", "testimonial", "inquiry", "contact"];
      for (const key of sections) {
        expect(body.content).toHaveProperty(key);
      }
    });

    test("[Test_16] should return the correct navigation badge", () => {
      expect(body.content.navigation.badge).toBe("Enterprise Staffing Solutions");
    });

    test("[Test_17] should return the correct features section titles", () => {
      const features = body.content.features;
      expect(features.absoluteReliability.title).toBe("Built on Absolute Reliability");
      expect(features.onDemandStaffing.title).toBe("Reliable On-Demand Staffing");
      expect(features.certifiedProfessionals.title).toBe("Personal, Compassionate Care");
      expect(features.easyManagement.title).toBe("Simple, Direct Coordination");
    });

    test("[Test_18] should return the correct calculator section title", () => {
      expect(body.content.calculator.title).toBe("Optimize Your Staffing Budget");
    });

    test("[Test_19] should return 3 care level options in the calculator", () => {
      expect(body.content.calculator.labels.careLevels).toHaveLength(3);
    });

    test("[Test_20] should return the correct inquiry section title", () => {
      expect(body.content.inquiry.title).toBe("Start Your Partnership Inquiry");
    });

    test("[Test_21] should return the correct testimonial author", () => {
      expect(typeof body.content.testimonial.author).toBe("string");
      expect(body.content.testimonial.author.length).toBeGreaterThan(0);
    });

    test("[Test_22] should return contact info with phone, email, and address", () => {
      const contact = body.content.contact;
      expect(contact).toHaveProperty("visible");
      expect(contact).toHaveProperty("phone");
      expect(contact).toHaveProperty("email");
      expect(contact).toHaveProperty("address");
    });
  });
});
