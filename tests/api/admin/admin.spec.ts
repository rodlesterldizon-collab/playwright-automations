import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { getAdminCredentials, getCaregiverCredentials, getAdminData } from "../../helpers.js";

test.describe("Backend Administrative Control API Spec", () => {
  const adminData = getAdminData();

  const testEmployee = {
    ...adminData.testEmployee,
    id: `emp-test-${faker.string.alphanumeric(7)}`,
    username: faker.internet.email({ provider: "compassioncare.com" })
  };

  let caregiverId = "";

  // Establish state in beforeEach/beforeAll if required.
  // In Playwright, beforeAll can get a fresh APIRequestContext using playwright.request.newContext()
  test.beforeAll(async ({ playwright }) => {
    const requestContext = await playwright.request.newContext();
    const caregiver = getCaregiverCredentials();
    
    // Login as caregiver to fetch ID
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
      caregiverId = "elena_rod_932a"; // fallback to standard seeded ID
    }
    await requestContext.dispose();
  });

  // Skipped to prevent HTTP 429 (Too Many Requests) rate limiting on demo Google Cloud hosting.
  test.skip("[Test_01] should allow administrators to register, fetch, deactivate, reactivate and delete employees", async ({ request }) => {
    const admin = getAdminCredentials();
    
    // Log in as administrator
    const loginRes = await request.post("/api/auth/login", {
      data: { email: admin.email, password: admin.password }
    });
    expect(loginRes.ok()).toBe(true);

    // 1. Add employee
    const addRes = await request.post("/api/admin/add-employee", {
      data: { employee: testEmployee }
    });
    expect(addRes.status()).toBe(200);
    const addBody = await addRes.json();
    expect(addBody.success).toBe(true);

    // 2. Fetch the newly created employee to verify its existence
    const fetchRes = await request.get(`/api/admin/employees/${testEmployee.id}`);
    expect(fetchRes.status()).toBe(200);
    const fetchBody = await fetchRes.json();
    expect(fetchBody.success).toBe(true);
    expect(fetchBody.employee.name).toBe(testEmployee.name);
    expect(fetchBody.employee.status).toBe("active");

    // 3. Deactivate employee
    const deactivateRes = await request.post("/api/admin/deactivate-employee", {
      data: { employeeId: testEmployee.id }
    });
    expect(deactivateRes.status()).toBe(200);
    const deactivateBody = await deactivateRes.json();
    expect(deactivateBody.success).toBe(true);

    // Verify state is deactivated
    const fetchRes2 = await request.get(`/api/admin/employees/${testEmployee.id}`);
    const fetchBody2 = await fetchRes2.json();
    expect(fetchBody2.employee.status).toBe("deactivated");

    // 4. Reactivate employee
    const reactivateRes = await request.post("/api/admin/reactivate-employee", {
      data: { employeeId: testEmployee.id }
    });
    expect(reactivateRes.status()).toBe(200);
    const reactivateBody = await reactivateRes.json();
    expect(reactivateBody.success).toBe(true);

    // Verify state is active again
    const fetchRes3 = await request.get(`/api/admin/employees/${testEmployee.id}`);
    const fetchBody3 = await fetchRes3.json();
    expect(fetchBody3.employee.status).toBe("active");

    // 5. Soft-delete employee
    const deleteRes = await request.post("/api/admin/delete-employee", {
      data: { employeeId: testEmployee.id }
    });
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.success).toBe(true);

    // Verify single fetch returns 404 (soft-deleted)
    const fetchRes4 = await request.get(`/api/admin/employees/${testEmployee.id}`);
    expect(fetchRes4.status()).toBe(404);
  });

  // Skipped to prevent HTTP 429 (Too Many Requests) rate limiting on demo Google Cloud hosting.
  test.skip("[Test_02] should allow administrators to assign, schedule, and permanently delete client shifts", async ({ request }) => {
    const admin = getAdminCredentials();
    await request.post("/api/auth/login", {
      data: { email: admin.email, password: admin.password }
    });

    const shiftId = `shift-test-${faker.string.alphanumeric(7)}`;
    const mockShift = {
      ...adminData.mockShift,
      id: shiftId,
      employeeId: caregiverId
    };

    // 1. Assign shift
    const addRes = await request.post("/api/admin/add-schedule", {
      data: { schedule: mockShift }
    });
    expect(addRes.status()).toBe(200);
    const addBody = await addRes.json();
    expect(addBody.success).toBe(true);

    // 2. Fetch schedules to confirm rendering in lists
    const schedulesRes = await request.get(`/api/admin/schedules?employee_id=${caregiverId}`);
    expect(schedulesRes.status()).toBe(200);
    const schedulesBody = await schedulesRes.json();
    const assignedShift = schedulesBody.schedules.find((s: any) => s.id === shiftId);
    expect(assignedShift).toBeDefined();
    expect(assignedShift.clientName).toBe("Arthur Miller");
    expect(assignedShift.location).toBe("Oakwood Estates");

    // 3. Delete shift permanently
    const deleteRes = await request.post("/api/admin/delete-schedule", {
      data: { scheduleId: shiftId, permanent: true }
    });
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.success).toBe(true);

    // Verify shift is removed from lists
    const schedulesRes2 = await request.get(`/api/admin/schedules?employee_id=${caregiverId}`);
    const schedulesBody2 = await schedulesRes2.json();
    const assignedShift2 = schedulesBody2.schedules.find((s: any) => s.id === shiftId);
    expect(assignedShift2).toBeUndefined();
  });

  // Skipped to prevent HTTP 429 (Too Many Requests) rate limiting on demo Google Cloud hosting.
  test.skip("[Test_03] should allow administrators to audit and update caregiver leave requests", async ({ request, playwright }) => {
    // 1. Submit a leave request as a caregiver first
    const caregiver = getCaregiverCredentials();
    const caregiverCtx = await playwright.request.newContext();
    await caregiverCtx.post("/api/auth/login", {
      data: { email: caregiver.email, password: caregiver.password }
    });

    const leaveId = `leave-test-${faker.string.alphanumeric(7)}`;
    const mockLeave = {
      ...adminData.mockLeave,
      id: leaveId,
      employeeId: caregiverId,
      timestamp: new Date().toLocaleString()
    };

    const addLeaveRes = await caregiverCtx.post("/api/admin/add-leave-request", {
      data: { request: mockLeave }
    });
    expect(addLeaveRes.status()).toBe(200);
    await caregiverCtx.dispose();

    // 2. Log in back as administrator to update leave status
    const admin = getAdminCredentials();
    await request.post("/api/auth/login", {
      data: { email: admin.email, password: admin.password }
    });

    // Approve request
    const approveRes = await request.post("/api/admin/update-leave-status", {
      data: {
        id: leaveId,
        status: "Approved",
        adminComment: "Coverage secured."
      }
    });
    expect(approveRes.status()).toBe(200);
    const approveBody = await approveRes.json();
    expect(approveBody.success).toBe(true);

    // Verify status has been updated in database
    const fetchRes = await request.get(`/api/admin/leave-requests?employee_id=${caregiverId}`);
    expect(fetchRes.status()).toBe(200);
    const fetchBody = await fetchRes.json();
    const auditedRequest = fetchBody.leaves.find((l: any) => l.id === leaveId);
    expect(auditedRequest).toBeDefined();
    expect(auditedRequest.status).toBe("Approved");
    expect(auditedRequest.adminComment).toBe("Coverage secured.");
  });
});
