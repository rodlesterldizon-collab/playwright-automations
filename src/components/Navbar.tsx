import React from 'react';
import { Heart, Play } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  corporateBadge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, corporateBadge }) => {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Partnerships', href: '/partners' },
    { name: 'Portal', href: '/login' },
    { name: 'Privacy', href: '/privacy' }
  ];

  return (
    <header id="header" class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo Button */}
        <div class="flex items-center space-x-3">
          <button
            id="nav-logo-btn"
            aria-label="CompassionCare Logo - Return to Homepage"
            onClick={() => onNavigate('/')}
            class="flex items-center space-x-2.5 text-left group focus:outline-hidden"
          >
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
              <Heart class="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <span class="text-xl font-bold tracking-tight text-slate-900 font-serif">CompassionCare</span>
              {corporateBadge && (
                <span class="block text-xs font-semibold text-teal-600 uppercase tracking-wider">
                  {corporateBadge}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav role="navigation" class="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <button
                key={item.name}
                id={`nav-link-${item.name.toLowerCase()}`}
                onClick={() => onNavigate(item.href)}
                class={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {item.name}
              </button>
            );
          })}

          {/* Test Automation Suite Quick Access Button */}
          <button
            id="nav-link-test-runner"
            onClick={() => onNavigate('/test-runner')}
            class="ml-2 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            <Play class="w-3.5 h-3.5 fill-purple-700" />
            <span>Test Runner</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
