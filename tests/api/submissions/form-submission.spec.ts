import { test, expect } from "@playwright/test";
import { getHomeData, getPartnersData } from "../../helpers.js";

test.describe("Form Submissions API Field Validation Spec", () => {
  const homeData = getHomeData();
  const partnersData = getPartnersData();
  
  // ─── Consultation Endpoint (/api/consultation) ─────────────────────────────

  test.describe("POST /api/consultation", () => {
    test("[Test_01] should successfully submit a valid consultation request", async ({ request }) => {
      const payload = homeData.consultationForm.desktop;

      const res = await request.post("/api/consultation", {
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          typeOfCare: payload.typeOfCare,
          helpDescription: payload.helpDescription
        }
      });
      expect(res.status()).toBe(200);
    });

    test("[Test_02] should reject submission when email format is invalid", async ({ request }) => {
      const payload = homeData.consultationForm.invalidEmail;

      const res = await request.post("/api/consultation", {
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          typeOfCare: payload.typeOfCare,
          helpDescription: payload.helpDescription
        }
      });
      expect([400, 422]).toContain(res.status());
    });

    test("[Test_03] should reject submission when required fields are missing", async ({ request }) => {
      const payload = homeData.consultationForm.incomplete;

      const res = await request.post("/api/consultation", {
        data: payload
      });
      expect([400, 422]).toContain(res.status());
    });
  });

  // ─── Partnership Endpoint (/api/partnership) ───────────────────────────────

  test.describe("POST /api/partnership", () => {
    test("[Test_04] should successfully submit a valid partnership inquiry", async ({ request }) => {
      const payload = partnersData.inquiryForm.desktop;

      const res = await request.post("/api/partnership", {
        data: {
          name: payload.name,
          email: payload.email,
          orgType: payload.orgType,
          needs: payload.needs
        }
      });
      expect(res.status()).toBe(200);
    });

    test("[Test_05] should reject inquiry when email format is invalid", async ({ request }) => {
      const payload = partnersData.inquiryForm.invalidEmail;

      const res = await request.post("/api/partnership", {
        data: {
          name: payload.name,
          email: payload.email,
          orgType: payload.orgType,
          needs: payload.needs
        }
      });
      expect([400, 422]).toContain(res.status());
    });

    test("[Test_06] should reject inquiry when mandatory fields are missing", async ({ request }) => {
      const payload = partnersData.inquiryForm.incomplete;

      const res = await request.post("/api/partnership", {
        data: payload
      });
      expect([400, 422]).toContain(res.status());
    });
  });
});
