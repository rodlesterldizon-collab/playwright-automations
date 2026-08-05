import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { getFutureDateString, getCaregiverCredentials, getPortalData, getAuthData } from "../../helpers.js";

test.describe("Caregiver Operational Portal API Contract Spec", () => {
  const portalData = getPortalData();
  const authData = getAuthData();

  let caregiverId = "";

  test.beforeAll(async ({ playwright }) => {
    const requestContext = await playwright.request.newContext();
    const caregiver = getCaregiverCredentials();
    
    const loginRes = await requestContext.post("/api/auth/login", {
      data: { email: caregiver.email, password: caregiver.password }
    });
    if (loginRes.ok()) {
      const meRes = await requestContext.get("/api/auth/me");
      if (meRes.ok()) {
        const body = await meRes.json();
        caregiverId = body.employee?.id || "elena_rod_932a";
      }
    }
    if (!caregiverId) {
      caregiverId = "elena_rod_932a";
    }
    await requestContext.dispose();
  });

  test.skip("[Test_01] should allow caregivers to read their own assigned schedules", async ({ request }) => {
    const caregiver = getCaregiverCredentials();
    await request.post("/api/auth/login", {
      data: caregiver
    });

    const res = await request.get(`/api/admin/schedules?employee_id=${caregiverId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.schedules)).toBe(true);
    if (body.schedules.length > 0) {
      expect(body.schedules[0].employeeId).toBe(caregiverId);
    }
  });

  test.skip("[Test_02] should prevent non-admins from reading other employees schedules", async ({ request }) => {
    const caregiver = getCaregiverCredentials();
    await request.post("/api/auth/login", {
      data: caregiver
    });

    const res = await request.get(`/api/admin/schedules?employee_id=temp-employee-id`);
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Access denied");
  });

  test.skip("[Test_03] should allow caregivers to submit leave requests programmatically", async ({ request }) => {
    const caregiver = getCaregiverCredentials();
    await request.post("/api/auth/login", {
      data: caregiver
    });

    const leaveId = `leave-test-${faker.string.alphanumeric(7)}`;
    const mockLeaveRequest = {
      ...portalData.leaveRequest,
      id: leaveId,
      employeeId: caregiverId,
      startDate: getFutureDateString(5),
      endDate: getFutureDateString(7),
      timestamp: new Date().toLocaleString("en-US", { hour12: true })
    };

    const res = await request.post("/api/admin/add-leave-request", {
      data: { request: mockLeaveRequest }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    // Verify the leave request can be fetched
    const fetchRes = await request.get(`/api/admin/leave-requests?employee_id=${caregiverId}`);
    expect(fetchRes.status()).toBe(200);
    const fetchBody = await fetchRes.json();
    const addedRequest = fetchBody.leaves.find((l: any) => l.id === leaveId);
    expect(addedRequest).toBeDefined();
    expect(addedRequest.reason).toBe("Sick");
    expect(addedRequest.status).toBe("Pending Approval");
  });

  test.skip("[Test_04] should allow caregivers to submit clock actions for their scheduled shifts", async ({ request }) => {
    const caregiver = getCaregiverCredentials();
    await request.post("/api/auth/login", {
      data: caregiver
    });

    // 1. Fetch Elena's schedules to find a valid schedule ID to act on
    const res = await request.get(`/api/admin/schedules?employee_id=${caregiverId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    const targetSchedule = body.schedules.find((s: any) => s.status !== "completed" && s.status !== "inactive");

    if (targetSchedule) {
      // 2. Perform Clock In Action
      const clockInRes = await request.post("/api/admin/clock-action", {
        data: {
          scheduleId: targetSchedule.id,
          action: "clock_in",
          employeeId: caregiverId,
          employeeName: "Elena Rodriguez"
        }
      });
      expect(clockInRes.status()).toBe(200);
      const clockInBody = await clockInRes.json();
      expect(clockInBody.success).toBe(true);

      // 3. Perform Shift Completion Action
      const completeRes = await request.post("/api/admin/clock-action", {
        data: {
          scheduleId: targetSchedule.id,
          action: "complete",
          employeeId: caregiverId,
          employeeName: "Elena Rodriguez"
        }
      });
      expect(completeRes.status()).toBe(200);
      const completeBody = await completeRes.json();
      expect(completeBody.success).toBe(true);
    }
  });

  test.skip("[Test_05] should reject unauthorized actions on other employees clockings", async ({ request }) => {
    const caregiver = getCaregiverCredentials();
    await request.post("/api/auth/login", {
      data: caregiver
    });

    const res = await request.post("/api/admin/clock-action", {
      data: portalData.unauthorizedShift
    });
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test.skip("[Test_06] should isolate privileges by denying employees access to the registry list", async ({ request }) => {
    const caregiver = getCaregiverCredentials();
    await request.post("/api/auth/login", {
      data: caregiver
    });

    const res = await request.get("/api/admin/employees");
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Access denied");
  });

  test.skip("[Test_07] should isolate privileges by denying employees access to add personnel", async ({ request }) => {
    const caregiver = getCaregiverCredentials();
    await request.post("/api/auth/login", {
      data: caregiver
    });

    const res = await request.post("/api/admin/add-employee", {
      data: {
        employee: portalData.unauthorizedEmployee
      }
    });
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});

test.describe("Rate Limiter Protection API Spec", () => {
  test.skip("[Test_08] should enforce 429 status code on excessive login requests to block rapid automated attacks", async ({ request }) => {
    const hitLoginEndpoint = () => {
      return request.post("/api/auth/login", {
        data: authData.rateLimitUser
      });
    };

    // Firing 5 baseline attempts followed by the 6th limit-breaker attempt
    await hitLoginEndpoint();
    await hitLoginEndpoint();
    await hitLoginEndpoint();
    await hitLoginEndpoint();
    await hitLoginEndpoint();
    
    const finalRes = await hitLoginEndpoint();
    expect(finalRes.status()).toBe(429);
    const body = await finalRes.json();
    expect(body).toHaveProperty("error");
    expect(body.error).toContain("Too many login attempts");
  });
});
