import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// ─── IN-MEMORY DATA STORES ────────────────────────────────────────────────────

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "cc_cda_token_number";
const SPACE_ID = process.env.SPACE_ID || "ccspace_ID";

interface Employee {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: "admin" | "employee";
  status: "active" | "deactivated" | "deleted";
}

let employees: Employee[] = [
  {
    id: "admin-1",
    name: "System Administrator",
    username: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "admin",
    role: "admin",
    status: "active"
  },
  {
    id: "elena_rod_932a",
    name: "Elena Rodriguez",
    username: process.env.EMPLOYEE_EMAIL || "employee@example.com",
    password: process.env.EMPLOYEE_PASSWORD || "admin",
    role: "employee",
    status: "active"
  }
];

interface Schedule {
  id: string;
  employeeId: string;
  clientName: string;
  time: string;
  location: string;
  status: "upcoming" | "clocked_in" | "completed" | "inactive";
  dateKey: string;
  shiftType: string;
  notes: string;
  month: string;
  year: number;
  date: string;
  dateLabel: string;
}

let schedules: Schedule[] = [
  {
    id: "shift-001",
    employeeId: "elena_rod_932a",
    clientName: "Arthur Miller",
    time: "08:00 - 16:00",
    location: "Oakwood Estates, Suite 204",
    status: "upcoming",
    dateKey: "MON",
    shiftType: "Day",
    notes: "Ensure morning meds and memory therapy routine.",
    month: "July",
    year: 2026,
    date: "2026-07-27",
    dateLabel: "MON 27"
  },
  {
    id: "shift-002",
    employeeId: "elena_rod_932a",
    clientName: "Florence Nightingale",
    time: "16:30 - 21:30",
    location: "Sunrise Manor, Room 102",
    status: "upcoming",
    dateKey: "TUE",
    shiftType: "Evening",
    notes: "Assistance with evening meal and mobility support.",
    month: "July",
    year: 2026,
    date: "2026-07-28",
    dateLabel: "TUE 28"
  }
];

interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending Approval" | "Approved" | "Rejected";
  timestamp: string;
  adminComment?: string;
}

let leaveRequests: LeaveRequest[] = [];
let consultations: any[] = [];
let partnerships: any[] = [];

// Rate limiting state for login attempts
const loginAttempts = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const record = loginAttempts.get(ip);
  if (!record || now - record.lastReset > windowMs) {
    loginAttempts.set(ip, { count: 1, lastReset: now });
    return false;
  }
  record.count += 1;
  return record.count > 5;
}

// ─── HELPER / MIDDLEWARE ──────────────────────────────────────────────────────

function getSessionUser(req: express.Request): Employee | null {
  const sessionCookie = req.cookies.CC_SESSION;
  if (!sessionCookie) return null;
  try {
    const parsed = JSON.parse(sessionCookie);
    const emp = employees.find(e => e.id === parsed.id && e.status !== "deleted");
    return emp || null;
  } catch {
    return null;
  }
}

// ─── API ROUTES ───────────────────────────────────────────────────────────────

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Auth endpoints
app.post("/api/auth/login", (req, res) => {
  const ip = req.ip || "unknown-client";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many login attempts. Please try again later." });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }

  const emp = employees.find(
    e => (e.username.toLowerCase() === email.toLowerCase() || e.id === email) &&
         e.password === password &&
         e.status !== "deleted" && e.status !== "deactivated"
  );

  if (!emp) {
    return res.status(401).json({ success: false, error: "Invalid email or password." });
  }

  const sessionData = { id: emp.id, role: emp.role, username: emp.username };
  res.cookie("CC_SESSION", JSON.stringify(sessionData), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  const { password: _, ...employeeWithoutPassword } = emp;
  return res.json({
    success: true,
    employee: employeeWithoutPassword
  });
});

app.get("/api/auth/me", (req, res) => {
  const emp = getSessionUser(req);
  if (!emp) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  const { password: _, ...employeeWithoutPassword } = emp;
  return res.json({
    success: true,
    employee: employeeWithoutPassword
  });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("CC_SESSION", { path: "/" });
  return res.json({ success: true });
});

// CMS Content Delivery API
app.get("/api/content/:spaceId/:pageId", (req, res) => {
  const { spaceId, pageId } = req.params;
  const token = req.query.access_token;

  if (!token || token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: "Unauthorized access token" });
  }

  if (spaceId !== SPACE_ID) {
    return res.status(404).json({ error: "Space not found" });
  }

  const updatedAt = new Date("2026-07-28T12:00:00Z").toISOString();

  if (pageId === "home") {
    return res.json({
      sys: { id: "home", space: SPACE_ID, type: "PageContent", updatedAt },
      content: {
        hero: {
          visible: true,
          badge: "Trusted Compassionate Care",
          titlePrefix: "Dedicated Caregivers for Your Loved Ones",
          description: "Providing high-quality in-home health, companionship, and specialized memory support across Ontario.",
          ctaServices: "Explore Our Services",
          ctaServicesHref: "#services",
          ctaHire: "Request Consultation",
          ctaHireHref: "#contact"
        },
        stats: {
          visible: true,
          items: [
            { value: "15,000+", label: "Care Hours Delivered" },
            { value: "98.5%", label: "Family Satisfaction Rate" },
            { value: "250+", label: "Certified Caregivers" },
            { value: "24/7", label: "On-Call Clinical Support" }
          ]
        },
        about: {
          visible: true,
          title: "Our Mission & Heartfelt Story",
          description: "CompassionCare was founded on the simple belief that every senior deserves dignified, personalized care in the comfort of their home.",
          features: [
            {
              title: "Vetted Caregivers",
              description: "Every team member undergoes background checks, skill verification, and ongoing compassion training."
            },
            {
              title: "Customized Care Plans",
              description: "Flexible scheduling and personalized care routines tailored to unique medical and emotional needs."
            },
            {
              title: "Family Portal Access",
              description: "Real-time updates, daily caregiver notes, and shift tracking for complete peace of mind."
            },
            {
              title: "24/7 Clinical Oversight",
              description: "Registered nurses on call around the clock to assist with emergency care adjustments."
            }
          ]
        },
        services: {
          visible: true,
          title: "Care Tailored to Your Needs",
          description: "Comprehensive healthcare, companionship, and specialized memory support programs.",
          items: [
            {
              title: "In-Home Care",
              description: "Assistance with daily living activities, hygiene, mobility, and meal preparation.",
              cta: "Learn More",
              href: "#contact"
            },
            {
              title: "Nursing Care",
              description: "Medication management, wound care, post-surgical support, and health monitoring by licensed nurses.",
              cta: "Learn More",
              href: "#contact"
            },
            {
              title: "Companionship",
              description: "Engaging social interaction, recreational activities, errands, and emotional support.",
              cta: "Learn More",
              href: "#contact"
            },
            {
              title: "Specialized Dementia Care",
              description: "Tailored memory care programs designed to foster cognitive stimulation and safety.",
              cta: "Learn More",
              href: "#contact",
              highlights: ["Memory Support", "Safety Monitoring", "Routine Consistency"]
            }
          ]
        },
        contact: {
          visible: true,
          title: "Schedule a Free Care Consultation",
          contactInfo: {
            phone: "(416) 555-0199",
            email: "info@compassioncare.ca",
            address: "100 University Ave, Suite 500, Toronto, ON"
          },
          form: {
            labels: {
              name: "Full Name",
              email: "Email Address",
              phone: "Phone Number",
              typeOfCare: "Type of Care",
              helpDescription: "How can we help?"
            },
            placeholders: {
              name: "e.g. Adelaide Vance",
              email: "e.g. adelaide@example.com",
              phone: "e.g. 416-555-0199",
              helpDescription: "Describe your care requirements..."
            },
            cta: "Request Consultation",
            successMessage: {
              title: "Consultation Requested!",
              description: "Thank you for reaching out. Our care coordinator will contact you within 24 hours."
            }
          }
        }
      }
    });
  }

  if (pageId === "corporate") {
    return res.json({
      sys: { id: "corporate", space: SPACE_ID, type: "PageContent", updatedAt },
      content: {
        navigation: {
          visible: true,
          badge: "Enterprise Staffing Solutions"
        },
        hero: {
          visible: true,
          badge: "Enterprise Staffing",
          titlePrefix: "Reliable Healthcare Staffing for Senior Living Facilities",
          description: "Scale your nursing and personal support staff on-demand with pre-vetted, certified healthcare professionals.",
          trustMarker: "Trusted by over 40+ healthcare institutions across Canada",
          cta: "Partner With Us",
          ctaHref: "#inquiry",
          ctaSecondary: "Calculate Savings",
          ctaSecondaryHref: "#calculator"
        },
        howItWorks: {
          visible: true,
          title: "How Partnering Works",
          link: {
            text: "Explore Partnership Models",
            href: "#features"
          }
        },
        features: {
          visible: true,
          title: "Why Partner With CompassionCare",
          description: "Seamless facility staffing integrations backed by technology and strict clinical compliance.",
          absoluteReliability: {
            title: "Built on Absolute Reliability",
            description: "99.4% shift fulfillment rate with 24/7 backup caregiver dispatch.",
            highlight: "99.4% Shift Fulfillment"
          },
          onDemandStaffing: {
            title: "Reliable On-Demand Staffing",
            description: "Instant shift coverage for emergency leaves, peak seasonal demands, or temporary vacancies.",
            highlights: ["Instant Dispatch", "Shift Coverage", "Zero Overtime Fees"]
          },
          certifiedProfessionals: {
            title: "Personal, Compassionate Care",
            description: "Fully licensed RNs, RPNs, and PSWs with specialized training in senior care and dementia.",
            list: ["Licensed RNs & RPNs", "Certified PSWs", "Background Checked"]
          },
          easyManagement: {
            title: "Simple, Direct Coordination",
            description: "Centralized portal for scheduling, automated invoicing, and credential verification.",
            cta: "Request Demo"
          }
        },
        calculator: {
          visible: true,
          title: "Optimize Your Staffing Budget",
          description: "Estimate monthly cost savings by using CompassionCare on-demand healthcare staffing.",
          labels: {
            careLevels: ["Personal Support Worker", "Registered Practical Nurse", "Registered Nurse"],
            residentCount: "Number of Resident Suites",
            weeklyShifts: "Weekly Shift Hours Needed",
            impactTitle: "Estimated Monthly Savings",
            impactValue: "$12,450 / mo"
          }
        },
        testimonial: {
          visible: true,
          quote: "CompassionCare has transformed our shift coverage. Their caregivers are skilled, punctual, and deeply compassionate.",
          author: "Sarah Jenkins",
          role: "Director of Care, Sunnybrook Senior Living"
        },
        inquiry: {
          visible: true,
          title: "Start Your Partnership Inquiry",
          description: "Fill out the form below to speak with our enterprise partnerships director.",
          fields: {
            name: "Contact Name",
            email: "Organization Email",
            orgType: "Facility Type",
            comments: "Staffing Needs & Details",
            placeholderName: "e.g. John Smith",
            placeholderEmail: "e.g. jsmith@facility.com",
            placeholderComments: "Describe your staffing requirements..."
          },
          cta: "Submit Partnership Inquiry",
          footerNote: "Our partnerships team responds within 4 business hours.",
          successMessage: {
            title: "Inquiry Received",
            description: "Our partnerships director is reviewing your staffing inquiry and will reach out shortly."
          }
        },
        contact: {
          visible: true,
          phone: "(416) 555-0199",
          email: "partnerships@compassioncare.ca",
          address: "100 University Ave, Suite 500, Toronto, ON"
        }
      }
    });
  }

  if (pageId === "navigation") {
    return res.json({
      sys: { id: "navigation", space: SPACE_ID, type: "PageContent", updatedAt },
      content: {
        links: [
          { name: "Home", href: "/", visible: true },
          { name: "Partnerships", href: "/partners", visible: true },
          { name: "Portal", href: "/login", visible: true },
          { name: "Privacy", href: "/privacy", visible: true }
        ]
      }
    });
  }

  if (pageId === "footer") {
    return res.json({
      sys: { id: "footer", space: SPACE_ID, type: "PageContent", updatedAt },
      content: {
        brand: { name: "CompassionCare" },
        copyright: { text: "© 2026 CompassionCare Inc. All rights reserved." }
      }
    });
  }

  return res.status(404).json({ error: "Page content not found" });
});

// Consultation Submission endpoint
app.post("/api/consultation", (req, res) => {
  const { name, email, phone, typeOfCare, helpDescription } = req.body || {};

  if (!name || !email || !phone || !typeOfCare || !helpDescription) {
    return res.status(400).json({ error: "Missing required form fields." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  const newSubmission = { id: `cons-${Date.now()}`, name, email, phone, typeOfCare, helpDescription, createdAt: new Date() };
  consultations.push(newSubmission);

  return res.json({ success: true, message: "Consultation requested successfully", submission: newSubmission });
});

// Partnership Submission endpoint
app.post("/api/partnership", (req, res) => {
  const { name, email, orgType, needs } = req.body || {};

  if (!name || !email || !orgType || !needs) {
    return res.status(400).json({ error: "Missing required form fields." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  const newPartnership = { id: `part-${Date.now()}`, name, email, orgType, needs, createdAt: new Date() };
  partnerships.push(newPartnership);

  return res.json({ success: true, message: "Partnership inquiry received", partnership: newPartnership });
});

// Admin Employee Management
app.get("/api/admin/employees", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const list = employees.filter(e => e.status !== "deleted").map(({ password, ...rest }) => rest);
  return res.json({ success: true, employees: list });
});

app.get("/api/admin/employees/:id", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const emp = employees.find(e => e.id === req.params.id && e.status !== "deleted");
  if (!emp) {
    return res.status(404).json({ success: false, error: "Employee not found." });
  }
  const { password: _, ...rest } = emp;
  return res.json({ success: true, employee: rest });
});

app.post("/api/admin/add-employee", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const { employee } = req.body || {};
  if (!employee || !employee.id || !employee.username) {
    return res.status(400).json({ success: false, error: "Invalid employee data." });
  }
  const newEmp: Employee = {
    id: employee.id,
    name: employee.name || "Employee",
    username: employee.username,
    password: employee.password || "admin",
    role: employee.role || "employee",
    status: employee.status || "active"
  };
  employees.push(newEmp);
  return res.json({ success: true, employee: newEmp });
});

app.post("/api/admin/deactivate-employee", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const { employeeId } = req.body || {};
  const emp = employees.find(e => e.id === employeeId);
  if (emp) {
    emp.status = "deactivated";
  }
  return res.json({ success: true });
});

app.post("/api/admin/reactivate-employee", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const { employeeId } = req.body || {};
  const emp = employees.find(e => e.id === employeeId);
  if (emp) {
    emp.status = "active";
  }
  return res.json({ success: true });
});

app.post("/api/admin/delete-employee", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const { employeeId } = req.body || {};
  const emp = employees.find(e => e.id === employeeId);
  if (emp) {
    emp.status = "deleted";
  }
  return res.json({ success: true });
});

// Admin Schedules & Caregiver Shifts
app.get("/api/admin/schedules", (req, res) => {
  const user = getSessionUser(req);
  const employeeIdQuery = req.query.employee_id as string;

  if (user?.role === "employee") {
    if (employeeIdQuery && employeeIdQuery !== user.id) {
      return res.status(403).json({ success: false, error: "Access denied. You can only view your own schedules." });
    }
  }

  let filtered = schedules;
  if (employeeIdQuery) {
    filtered = schedules.filter(s => s.employeeId === employeeIdQuery);
  }

  return res.json({ success: true, schedules: filtered });
});

app.post("/api/admin/add-schedule", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const { schedule } = req.body || {};
  if (!schedule || !schedule.id) {
    return res.status(400).json({ success: false, error: "Invalid schedule payload." });
  }
  schedules.push(schedule);
  return res.json({ success: true, schedule });
});

app.post("/api/admin/delete-schedule", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const { scheduleId } = req.body || {};
  schedules = schedules.filter(s => s.id !== scheduleId);
  return res.json({ success: true });
});

// Leave Requests
app.get("/api/admin/leave-requests", (req, res) => {
  const employeeIdQuery = req.query.employee_id as string;
  let filtered = leaveRequests;
  if (employeeIdQuery) {
    filtered = leaveRequests.filter(l => l.employeeId === employeeIdQuery);
  }
  return res.json({ success: true, leaves: filtered });
});

app.post("/api/admin/add-leave-request", (req, res) => {
  const { request } = req.body || {};
  if (!request || !request.id) {
    return res.status(400).json({ success: false, error: "Invalid leave request." });
  }
  leaveRequests.push(request);
  return res.json({ success: true, leave: request });
});

app.post("/api/admin/update-leave-status", (req, res) => {
  const user = getSessionUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
  }
  const { id, status, adminComment } = req.body || {};
  const leave = leaveRequests.find(l => l.id === id);
  if (leave) {
    leave.status = status;
    if (adminComment) leave.adminComment = adminComment;
  }
  return res.json({ success: true });
});

// Clock Actions
app.post("/api/admin/clock-action", (req, res) => {
  const user = getSessionUser(req);
  const { scheduleId, action, employeeId } = req.body || {};

  if (user?.role === "employee" && employeeId && employeeId !== user.id) {
    return res.status(403).json({ success: false, error: "Access denied. Unauthorized clock action for another employee." });
  }

  const shift = schedules.find(s => s.id === scheduleId);
  if (shift) {
    if (action === "clock_in") shift.status = "clocked_in";
    if (action === "complete") shift.status = "completed";
  }

  return res.json({ success: true });
});

// Test Runner API
app.get("/api/test-runner/specs", (_req, res) => {
  const specs = [
    { id: "homepage.spec.ts", name: "Public Landing Homepage E2E", category: "Pages", count: 6 },
    { id: "partners.spec.ts", name: "Corporate Partnerships E2E", category: "Pages", count: 7 },
    { id: "login.spec.ts", name: "Staff Login Portal E2E", category: "Pages", count: 4 },
    { id: "admin-portal.spec.ts", name: "Admin Administrative Portal", category: "Pages", count: 5 },
    { id: "employee-portal.spec.ts", name: "Caregiver Operational Portal", category: "Pages", count: 4 },
    { id: "navbar.spec.ts", name: "Global Header Navigation Bar", category: "Global", count: 7 },
    { id: "footer.spec.ts", name: "Global Footer Component", category: "Global", count: 4 },
    { id: "content.spec.ts", name: "CMS Content Delivery API", category: "API", count: 22 },
    { id: "content.schema.spec.ts", name: "CMS Content Delivery Schema (AJV)", category: "API", count: 22 },
    { id: "auth.spec.ts", name: "Backend Identity & Auth API", category: "API", count: 4 },
    { id: "admin.spec.ts", name: "Backend Administrative Control API", category: "API", count: 3 },
    { id: "portal.spec.ts", name: "Caregiver Operational Portal API", category: "API", count: 8 },
    { id: "form-submission.spec.ts", name: "Form Submissions API Field Validation", category: "API", count: 6 }
  ];
  res.json({ success: true, specs });
});

app.post("/api/test-runner/run", (req, res) => {
  const { specId } = req.body || {};
  const filter = specId ? `tests/**/${specId}` : "";
  const cmd = `npx playwright test ${filter} --reporter=list`;

  exec(cmd, { cwd: __dirname, timeout: 60000 }, (error, stdout, stderr) => {
    const output = stdout || stderr || (error ? error.message : "All tests executed.");
    const passed = !error || !error.code;
    res.json({
      success: true,
      passed,
      specId: specId || "all",
      command: cmd,
      output,
      timestamp: new Date().toISOString()
    });
  });
});

// ─── VITE MIDDLEWARE & SERVING ────────────────────────────────────────────────

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CompassionCare] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
