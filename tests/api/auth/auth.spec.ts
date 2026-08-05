import { test, expect } from "@playwright/test";
import { getAdminCredentials, getAuthData } from "../../helpers.js";

test.describe("Backend Identity & Auth API Contract Spec", () => {
  const authData = getAuthData();

  test.skip("[Test_01] should validate administrator credentials and set the secure HttpOnly cookie", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: getAdminCredentials()
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.employee.role).toBe("admin");

    // Assert CC_SESSION cookie header is returned
    const headers = res.headers();
    const setCookie = headers["set-cookie"] || "";
    expect(setCookie).toContain("CC_SESSION");
  });

  test.skip("[Test_02] should reject invalid credentials and return safe error parameters", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: authData.invalidUser
    });
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body).toHaveProperty("error");
  });

  test.skip("[Test_03] should verify the active session safely via the me route without leaking secrets", async ({ request }) => {
    const credentials = getAdminCredentials();
    
    // Log in programmatically first
    await request.post("/api/auth/login", {
      data: credentials
    });

    const res = await request.get("/api/auth/me");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.employee.role).toBe("admin");
    expect(body.employee).not.toHaveProperty("password"); // Password must be stripped completely from session profiles
  });

  test.skip("[Test_04] should log out programmatically and purge browser sessions", async ({ request }) => {
    const credentials = getAdminCredentials();
    await request.post("/api/auth/login", {
      data: credentials
    });

    const res = await request.post("/api/auth/logout");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    const headers = res.headers();
    const setCookie = headers["set-cookie"] || "";
    // On logout, cookie is usually deleted or set to empty/expired.
    expect(setCookie).toContain("CC_SESSION");
  });
});
