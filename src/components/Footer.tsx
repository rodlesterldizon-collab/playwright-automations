import React from 'react';
import { Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  brandName?: string;
  copyrightText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  brandName = "CompassionCare",
  copyrightText = "© 2026 CompassionCare Inc. All rights reserved."
}) => {
  return (
    <footer id="footer" class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Heart class="w-4 h-4 fill-slate-950" />
              </div>
              <span class="text-xl font-bold text-white font-serif">{brandName}</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Dignified in-home care services & healthcare staffing solutions across Ontario.
            </p>
          </div>

          {/* Quick Links */}
          <div class="space-y-3">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} class="hover:text-teal-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/partners')} class="hover:text-teal-400 transition-colors">
                  Partnerships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login')} class="hover:text-teal-400 transition-colors">
                  Staff Portal Login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/test-runner')} class="hover:text-teal-400 transition-colors text-purple-400">
                  Playwright Automation Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div class="space-y-3">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Legal & Governance</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <button id="footer-privacy-policy-link" onClick={() => onNavigate('/privacy')} class="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button id="footer-terms-of-service-link" onClick={() => onNavigate('/terms')} class="hover:text-teal-400 transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div class="space-y-3">
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Headquarters</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li class="flex items-start space-x-2">
                <MapPin class="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>100 University Ave, Suite 500, Toronto, ON</span>
              </li>
              <li class="flex items-center space-x-2">
                <Phone class="w-4 h-4 text-teal-400 shrink-0" />
                <span>(416) 555-0199</span>
              </li>
              <li class="flex items-center space-x-2">
                <Mail class="w-4 h-4 text-teal-400 shrink-0" />
                <span>info@compassioncare.ca</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p id="footer-copyright-text">{copyrightText}</p>
          <div class="flex items-center space-x-2 text-slate-400">
            <ShieldCheck class="w-4 h-4 text-teal-400" />
            <span>Encrypted & Verified Clinical Operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
