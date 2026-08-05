import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = () => {
  return (
    <div class="py-16 bg-slate-50 min-h-[80vh]">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div class="space-y-4 text-center">
          <span class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck class="w-3.5 h-3.5 text-teal-700" />
            <span>Healthcare Compliance & Protection</span>
          </span>

          <h1 class="text-4xl font-extrabold text-slate-900 font-serif">
            Privacy Policy & Clinical Governance
          </h1>

          <p class="text-slate-600 text-base max-w-2xl mx-auto">
            CompassionCare is committed to protecting patient healthcare information under Ontario's Personal Health Information Protection Act (PHIPA).
          </p>
        </div>

        <div class="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200 space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <div class="space-y-3">
            <h2 class="text-xl font-bold font-serif text-slate-900 flex items-center space-x-2">
              <Lock class="w-5 h-5 text-teal-600" />
              <span>1. Information Collection & Usage</span>
            </h2>
            <p>
              We collect personal health data, daily caregiver logs, and operational facility requirements strictly to deliver specialized home care and staffing services. All data is encrypted both in transit (TLS 1.3) and at rest (AES-256).
            </p>
          </div>

          <div class="space-y-3">
            <h2 class="text-xl font-bold font-serif text-slate-900 flex items-center space-x-2">
              <FileText class="w-5 h-5 text-teal-600" />
              <span>2. Family Portal Security & Verification</span>
            </h2>
            <p>
              Access to client shift updates, caregiver check-ins, and clinical notes is protected via role-based access control. Unauthorized access or data export is strictly prohibited.
            </p>
          </div>

          <div class="space-y-3">
            <h2 class="text-xl font-bold font-serif text-slate-900 flex items-center space-x-2">
              <ShieldCheck class="w-5 h-5 text-teal-600" />
              <span>3. Data Retention & Deletion Rights</span>
            </h2>
            <p>
              Clients and enterprise partners may request clinical data export or account closure by contacting our Privacy Officer at <span class="font-semibold text-teal-700">privacy@compassioncare.ca</span>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
