export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'employee';
}

export interface CmsHero {
  visible: boolean;
  badge: string;
  titlePrefix: string;
  description: string;
  ctaServices: string;
  ctaServicesHref: string;
  ctaHire: string;
  ctaHireHref: string;
}

export interface CmsStatItem {
  value: string;
  label: string;
}

export interface CmsAboutFeature {
  title: string;
  description: string;
}

export interface CmsServiceItem {
  title: string;
  description: string;
  cta: string;
  href: string;
  highlights?: string[];
}

export interface CmsHomeData {
  hero: CmsHero;
  stats: { visible: boolean; items: CmsStatItem[] };
  about: { visible: boolean; title: string; description: string; features: CmsAboutFeature[] };
  services: { visible: boolean; title: string; description: string; items: CmsServiceItem[] };
  contact: {
    visible: boolean;
    title: string;
    contactInfo: { phone: string; email: string; address: string };
    form: {
      labels: { name: string; email: string; phone: string; typeOfCare: string; helpDescription: string };
      placeholders: { name: string; email: string; phone: string; helpDescription: string };
      cta: string;
      successMessage: { title: string; description: string };
    };
  };
}

export interface CmsCorporateData {
  navigation: { visible: boolean; badge: string };
  hero: {
    visible: boolean;
    badge: string;
    titlePrefix: string;
    description: string;
    trustMarker: string;
    cta: string;
    ctaHref: string;
    ctaSecondary: string;
    ctaSecondaryHref: string;
  };
  howItWorks: { visible: boolean; title: string; link: { text: string; href: string } };
  features: {
    visible: boolean;
    title: string;
    description: string;
    absoluteReliability: { title: string; description: string; highlight: string };
    onDemandStaffing: { title: string; description: string; highlights: string[] };
    certifiedProfessionals: { title: string; description: string; list: string[] };
    easyManagement: { title: string; description: string; cta: string };
  };
  calculator: {
    visible: boolean;
    title: string;
    description: string;
    labels: {
      careLevels: string[];
      residentCount: string;
      weeklyShifts: string;
      impactTitle: string;
      impactValue: string;
    };
  };
  testimonial: { visible: boolean; quote: string; author: string; role: string };
  inquiry: {
    visible: boolean;
    title: string;
    description: string;
    fields: {
      name: string;
      email: string;
      orgType: string;
      comments: string;
      placeholderName: string;
      placeholderEmail: string;
      placeholderComments: string;
    };
    cta: string;
    footerNote: string;
    successMessage: { title: string; description: string };
  };
  contact: { visible: boolean; phone: string; email: string; address: string };
}
