import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Mail, Shield, AlertCircle, HelpCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // IT Support Form State
  const [showItSupport, setShowItSupport] = useState(false);
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.employee);
        if (data.employee.role === 'admin') {
          onNavigate('/admin');
        } else {
          onNavigate('/employee');
        }
      } else {
        setErrorMessage(data.error || 'Invalid credentials');
      }
    } catch {
      setErrorMessage('Network authentication failure');
    } finally {
      setLoading(false);
    }
  };

  const handleItSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supportEmail) {
      setSupportSubmitted(true);
    }
  };

  return (
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
        
        {/* Headings */}
        <div class="text-center space-y-2">
          <div class="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
            <Shield class="w-6 h-6" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900 font-serif">
            CompassionCare Staff & Portal Access
          </h1>
          <h2 class="text-lg font-semibold text-slate-800">
            Sign in to your Account
          </h2>
          <p class="text-xs text-slate-500">
            Enter your organizational credentials to access clinical schedules or admin panels.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} class="space-y-4 pt-2">
          {errorMessage && (
            <div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center space-x-2">
              <AlertCircle class="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div class="space-y-1">
            <label htmlFor="email" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Work Email or Username
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail class="w-4 h-4" />
              </div>
              <input
                id="email"
                type="text"
                required
                placeholder="e.g. employee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label htmlFor="password" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock class="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
              />
            </div>
          </div>

          {/* Form Action Links */}
          <div class="flex items-center justify-between text-xs font-medium pt-1">
            <button
              type="button"
              onClick={() => alert("Password reset link sent to registered email.")}
              class="text-teal-600 hover:text-teal-700 hover:underline"
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => setShowItSupport(!showItSupport)}
              class="text-slate-500 hover:text-slate-800 hover:underline"
            >
              Contact IT Support
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-md transition-colors disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>

          {/* Google SSO Button */}
          <div class="pt-2">
            <button
              type="button"
              onClick={() => {
                setEmail('employee@example.com');
                setPassword('admin');
              }}
              class="w-full py-3 rounded-xl bg-white text-slate-700 font-semibold text-xs border border-slate-300 hover:bg-slate-50 flex items-center justify-center space-x-2 transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Sign in with Google SSO</span>
            </button>
          </div>

          {/* Quick Demo Pre-fill */}
          <div class="pt-4 border-t border-slate-200/80 text-center space-y-2">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Demo Quick Login</span>
            <div class="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@example.com'); setPassword('admin'); }}
                class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Admin Credentials
              </button>
              <button
                type="button"
                onClick={() => { setEmail('employee@example.com'); setPassword('admin'); }}
                class="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold hover:bg-teal-100"
              >
                Caregiver Credentials
              </button>
            </div>
          </div>
        </form>

        {/* IT Support Form Drawer / Dropdown */}
        {showItSupport && (
          <div class="mt-4 p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3">
            <div class="flex items-center space-x-2 text-slate-800 text-xs font-bold">
              <HelpCircle class="w-4 h-4 text-teal-600" />
              <span>CompassionCare IT Support Request</span>
            </div>

            {supportSubmitted ? (
              <div class="p-3 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                Request Submitted! Our IT desk will issue a password reset ticket within 15 minutes.
              </div>
            ) : (
              <form onSubmit={handleItSupportSubmit} class="space-y-2">
                <input
                  id="supportEmail"
                  type="email"
                  required
                  placeholder="Enter your organizational email..."
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-hidden"
                />
                <button
                  type="submit"
                  class="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
