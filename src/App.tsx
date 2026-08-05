import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { PartnersPage } from './components/PartnersPage';
import { LoginPage } from './components/LoginPage';
import { AdminPortalPage } from './components/AdminPortalPage';
import { EmployeePortalPage } from './components/EmployeePortalPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TestRunnerPage } from './components/TestRunnerPage';
import { User, CmsHomeData, CmsCorporateData } from './types';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // CMS state
  const [homeData, setHomeData] = useState<CmsHomeData | null>(null);
  const [corporateData, setCorporateData] = useState<CmsCorporateData | null>(null);

  // Fetch CMS data & restore session
  useEffect(() => {
    const token = 'cc_cda_token_number';
    const spaceId = 'ccspace_ID';

    // Fetch Home CMS Data
    fetch(`/api/content/${spaceId}/home?access_token=${token}`)
      .then(res => res.json())
      .then(json => {
        if (json.content) setHomeData(json.content);
      })
      .catch(() => {});

    // Fetch Corporate CMS Data
    fetch(`/api/content/${spaceId}/corporate?access_token=${token}`)
      .then(res => res.json())
      .then(json => {
        if (json.content) setCorporateData(json.content);
      })
      .catch(() => {});

    // Check auth session
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.employee) {
          setCurrentUser(json.employee);
        }
      })
      .catch(() => {});
  }, []);

  // Listen to popstate for URL navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fallback default CMS content if loading or offline
  const defaultHomeData: CmsHomeData = {
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
        { title: "Vetted Caregivers", description: "Every team member undergoes background checks, skill verification, and ongoing compassion training." },
        { title: "Customized Care Plans", description: "Flexible scheduling and personalized care routines tailored to unique medical and emotional needs." },
        { title: "Family Portal Access", description: "Real-time updates, daily caregiver notes, and shift tracking for complete peace of mind." },
        { title: "24/7 Clinical Oversight", description: "Registered nurses on call around the clock to assist with emergency care adjustments." }
      ]
    },
    services: {
      visible: true,
      title: "Care Tailored to Your Needs",
      description: "Comprehensive healthcare, companionship, and specialized memory support programs.",
      items: [
        { title: "In-Home Care", description: "Assistance with daily living activities, hygiene, mobility, and meal preparation.", cta: "Learn More", href: "#contact" },
        { title: "Nursing Care", description: "Medication management, wound care, post-surgical support, and health monitoring by licensed nurses.", cta: "Learn More", href: "#contact" },
        { title: "Companionship", description: "Engaging social interaction, recreational activities, errands, and emotional support.", cta: "Learn More", href: "#contact" },
        { title: "Specialized Dementia Care", description: "Tailored memory care programs designed to foster cognitive stimulation and safety.", cta: "Learn More", href: "#contact", highlights: ["Memory Support", "Safety Monitoring", "Routine Consistency"] }
      ]
    },
    contact: {
      visible: true,
      title: "Schedule a Free Care Consultation",
      contactInfo: { phone: "(416) 555-0199", email: "info@compassioncare.ca", address: "100 University Ave, Suite 500, Toronto, ON" },
      form: {
        labels: { name: "Full Name", email: "Email Address", phone: "Phone Number", typeOfCare: "Type of Care", helpDescription: "How can we help?" },
        placeholders: { name: "e.g. Adelaide Vance", email: "e.g. adelaide@example.com", phone: "e.g. 416-555-0199", helpDescription: "Describe your care requirements..." },
        cta: "Request Consultation",
        successMessage: { title: "Consultation Requested!", description: "Thank you for reaching out. Our care coordinator will contact you within 24 hours." }
      }
    }
  };

  const defaultCorporateData: CmsCorporateData = {
    navigation: { visible: true, badge: "Enterprise Staffing Solutions" },
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
    howItWorks: { visible: true, title: "How Partnering Works", link: { text: "Explore Partnership Models", href: "#features" } },
    features: {
      visible: true,
      title: "Why Partner With CompassionCare",
      description: "Seamless facility staffing integrations backed by technology and strict clinical compliance.",
      absoluteReliability: { title: "Built on Absolute Reliability", description: "99.4% shift fulfillment rate with 24/7 backup caregiver dispatch.", highlight: "99.4% Shift Fulfillment" },
      onDemandStaffing: { title: "Reliable On-Demand Staffing", description: "Instant shift coverage for emergency leaves, peak seasonal demands, or temporary vacancies.", highlights: ["Instant Dispatch", "Shift Coverage", "Zero Overtime Fees"] },
      certifiedProfessionals: { title: "Personal, Compassionate Care", description: "Fully licensed RNs, RPNs, and PSWs with specialized training in senior care and dementia.", list: ["Licensed RNs & RPNs", "Certified PSWs", "Background Checked"] },
      easyManagement: { title: "Simple, Direct Coordination", description: "Centralized portal for scheduling, automated invoicing, and credential verification.", cta: "Request Demo" }
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
    testimonial: { visible: true, quote: "CompassionCare has transformed our shift coverage. Their caregivers are skilled, punctual, and deeply compassionate.", author: "Sarah Jenkins", role: "Director of Care, Sunnybrook Senior Living" },
    inquiry: {
      visible: true,
      title: "Start Your Partnership Inquiry",
      description: "Fill out the form below to speak with our enterprise partnerships director.",
      fields: { name: "Contact Name", email: "Organization Email", orgType: "Facility Type", comments: "Staffing Needs & Details", placeholderName: "e.g. John Smith", placeholderEmail: "e.g. jsmith@facility.com", placeholderComments: "Describe your staffing requirements..." },
      cta: "Submit Partnership Inquiry",
      footerNote: "Our partnerships team responds within 4 business hours.",
      successMessage: { title: "Inquiry Received", description: "Our partnerships director is reviewing your staffing inquiry and will reach out shortly." }
    },
    contact: { visible: true, phone: "(416) 555-0199", email: "partnerships@compassioncare.ca", address: "100 University Ave, Suite 500, Toronto, ON" }
  };

  const isCorporate = currentPath === '/partners';
  const corporateBadgeText = isCorporate ? (corporateData || defaultCorporateData).navigation?.badge : undefined;

  return (
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        corporateBadge={corporateBadgeText}
      />

      <main class="flex-1">
        {currentPath === '/' && (
          <HomePage
            data={homeData || defaultHomeData}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/partners' && (
          <PartnersPage
            data={corporateData || defaultCorporateData}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/login' && (
          <LoginPage
            onLoginSuccess={(user) => setCurrentUser(user)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/admin' && (
          <AdminPortalPage
            currentUser={currentUser || { id: 'admin-1', name: 'System Administrator', username: 'admin@example.com', role: 'admin' }}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/employee' && (
          <EmployeePortalPage
            currentUser={currentUser || { id: 'elena_rod_932a', name: 'Elena Rodriguez', username: 'employee@example.com', role: 'employee' }}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/privacy' && (
          <PrivacyPage onNavigate={handleNavigate} />
        )}

        {currentPath === '/test-runner' && (
          <TestRunnerPage />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
