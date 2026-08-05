import React, { useState } from 'react';
import { CmsCorporateData } from '../types';
import { Building2, ShieldCheck, Users, Clock, Calculator, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

interface PartnersPageProps {
  data: CmsCorporateData;
  onNavigate: (path: string) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ data }) => {
  const { hero, howItWorks, features, calculator, testimonial, inquiry, contact } = data;

  const [selectedCareLevel, setSelectedCareLevel] = useState(calculator.labels.careLevels[0]);
  const [residentCount, setResidentCount] = useState(40);
  const [weeklyShifts, setWeeklyShifts] = useState(120);

  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    orgType: 'Assisted Living Facility',
    needs: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate dynamic impact value
  const calculateSavings = () => {
    const rateMultiplier = selectedCareLevel.includes('Nurse') ? 45 : 28;
    const monthlyEstimate = Math.round(residentCount * 150 + weeklyShifts * rateMultiplier * 4.2);
    return `$${monthlyEstimate.toLocaleString()} / mo`;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!inquiryData.name || !inquiryData.email || !inquiryData.needs) {
      setErrorMessage('Please fill in all required inquiry fields.');
      return;
    }

    try {
      const res = await fetch('/api/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (res.ok) {
        setInquirySubmitted(true);
      } else {
        const json = await res.json();
        setErrorMessage(json.error || 'Failed to submit inquiry.');
      }
    } catch {
      setErrorMessage('Network error while submitting inquiry.');
    }
  };

  return (
    <div class="space-y-0">
      
      {/* ─── SECTION 0: HERO SECTION (section nth 0) ─────────────────────────────── */}
      <section id="partner-hero" class="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div class="lg:col-span-7 space-y-6">
              <span class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide uppercase border border-teal-500/30">
                <Building2 class="w-3.5 h-3.5 text-teal-400" />
                <span>{hero.badge}</span>
              </span>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-serif text-white">
                {hero.titlePrefix}
              </h1>

              <p class="text-lg text-slate-300 leading-relaxed">
                {hero.description}
              </p>

              <div class="flex items-center space-x-2 text-xs font-medium text-teal-400">
                <ShieldCheck class="w-4 h-4 shrink-0" />
                <span>{hero.trustMarker}</span>
              </div>

              <div class="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const inquiryEl = document.getElementById('inquiry');
                    if (inquiryEl) inquiryEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  class="px-6 py-3.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-base hover:bg-teal-400 shadow-lg transition-all"
                >
                  {hero.cta}
                </button>

                <button
                  onClick={() => {
                    const calcEl = document.getElementById('calculator');
                    if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  class="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  {hero.ctaSecondary}
                </button>
              </div>
            </div>

            <div class="lg:col-span-5">
              <picture class="block rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 aspect-4/3 relative">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
                  alt="Enterprise healthcare facility staffing"
                  class="w-full h-full object-cover"
                />
              </picture>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 1: HOW IT WORKS & FEATURES SECTION (section nth 1) ──────────── */}
      <section id="features" class="py-20 bg-slate-50 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div id="how-it-works" class="text-center max-w-2xl mx-auto space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-widest text-teal-700">
              {howItWorks.title}
            </h3>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
              {features.title}
            </h2>
            <p class="text-base sm:text-lg text-slate-600">
              {features.description}
            </p>
            <div class="pt-2">
              <a href={howItWorks.link.href} class="text-sm font-semibold text-teal-600 hover:underline">
                {howItWorks.link.text} →
              </a>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 0: Absolute Reliability */}
            <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShieldCheck class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-slate-900 font-serif">
                  {features.absoluteReliability.title}
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  {features.absoluteReliability.description}
                </p>
              </div>
              <div>
                <span class="inline-block px-3 py-1 rounded-md bg-teal-100/70 text-teal-800 text-xs font-bold">
                  {features.absoluteReliability.highlight}
                </span>
              </div>
            </div>

            {/* Card 1: On-Demand Staffing */}
            <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Clock class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-slate-900 font-serif">
                  {features.onDemandStaffing.title}
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  {features.onDemandStaffing.description}
                </p>
              </div>
              <div class="flex flex-wrap gap-1.5">
                {features.onDemandStaffing.highlights.map((h, i) => (
                  <span key={i} class="px-2.5 py-1 rounded-md bg-teal-100/70 text-teal-800 text-xs font-semibold">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: Certified Professionals */}
            <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Users class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-slate-900 font-serif">
                  {features.certifiedProfessionals.title}
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  {features.certifiedProfessionals.description}
                </p>
              </div>
              <ul class="space-y-1.5 text-xs text-slate-700 font-medium">
                {features.certifiedProfessionals.list.map((item, i) => (
                  <li key={i} class="flex items-center space-x-1.5">
                    <CheckCircle2 class="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Easy Management */}
            <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <picture class="block w-full h-24 rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80"
                    alt="Direct Healthcare Coordination Portal"
                    class="w-full h-full object-cover"
                  />
                </picture>
                <h3 class="text-xl font-bold text-slate-900 font-serif">
                  {features.easyManagement.title}
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  {features.easyManagement.description}
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    const inquiryEl = document.getElementById('inquiry');
                    if (inquiryEl) inquiryEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  class="w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
                >
                  {features.easyManagement.cta}
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 2: ROI CALCULATOR SECTION (section nth 2) ──────────────────── */}
      <section id="calculator" class="py-20 bg-white border-b border-slate-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div class="text-center space-y-3">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
              {calculator.title}
            </h2>
            <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {calculator.description}
            </p>
          </div>

          <div class="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div class="md:col-span-7 space-y-6">
              
              {/* Care Level Selection Buttons */}
              <div class="space-y-2">
                <span class="block text-sm font-semibold text-slate-700">Target Healthcare Care Level</span>
                <div class="flex flex-wrap gap-2">
                  {calculator.labels.careLevels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedCareLevel(lvl)}
                      class={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCareLevel === lvl
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Resident Suites */}
              <div class="space-y-2">
                <div class="flex justify-between text-sm font-semibold text-slate-700">
                  <span>{calculator.labels.residentCount}</span>
                  <span class="text-teal-700 font-bold">{residentCount} Suites</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={residentCount}
                  onChange={(e) => setResidentCount(Number(e.target.value))}
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Slider 2: Weekly Shift Hours */}
              <div class="space-y-2">
                <div class="flex justify-between text-sm font-semibold text-slate-700">
                  <span>{calculator.labels.weeklyShifts}</span>
                  <span class="text-teal-700 font-bold">{weeklyShifts} Hours / wk</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={weeklyShifts}
                  onChange={(e) => setWeeklyShifts(Number(e.target.value))}
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

            </div>

            {/* Impact Display Card */}
            <div class="md:col-span-5 bg-teal-900 text-white p-8 rounded-2xl text-center space-y-3 shadow-lg">
              <Calculator class="w-10 h-10 text-teal-400 mx-auto" />
              <h3 class="text-lg font-bold font-serif text-teal-100">
                {calculator.labels.impactTitle}
              </h3>
              <div class="text-3xl sm:text-4xl font-extrabold text-white">
                {calculateSavings()}
              </div>
              <p class="text-xs text-slate-300">
                Based on average Ontario enterprise staffing benchmarks.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 3: TESTIMONIAL SECTION ──────────────────────────────────────── */}
      <section id="testimonial" class="py-16 bg-teal-900 text-white">
        <div class="max-w-4xl mx-auto px-4 text-center space-y-6">
          <blockquote class="text-xl sm:text-2xl font-serif italic text-teal-50 leading-relaxed">
            "{testimonial.quote}"
          </blockquote>
          <div class="space-y-0.5">
            <div class="text-lg font-bold text-white">{testimonial.author}</div>
            <div class="text-sm text-teal-300 font-medium">{testimonial.role}</div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: INQUIRY FORM SECTION ─────────────────────────────────────── */}
      <section id="inquiry" class="py-20 bg-slate-50">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div class="text-center space-y-3">
            <h2 class="text-3xl font-bold text-slate-900 font-serif">
              {inquiry.title}
            </h2>
            <p class="text-slate-600 text-base">
              {inquiry.description}
            </p>
          </div>

          <div class="bg-white p-8 sm:p-10 rounded-3xl shadow-md border border-slate-200">
            {inquirySubmitted ? (
              <div class="py-12 text-center space-y-4">
                <div class="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 class="w-10 h-10" />
                </div>
                <h3 class="text-2xl font-bold font-serif text-slate-900">
                  {inquiry.successMessage.title}
                </h3>
                <p class="text-slate-600 max-w-md mx-auto">
                  {inquiry.successMessage.description}
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} class="space-y-5">
                {errorMessage && (
                  <div class="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-slate-700">
                      {inquiry.fields.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder={inquiry.fields.placeholderName}
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-hidden"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-slate-700">
                      {inquiry.fields.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder={inquiry.fields.placeholderEmail}
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-hidden"
                    />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-slate-700">
                    {inquiry.fields.orgType}
                  </label>
                  <select
                    name="orgType"
                    value={inquiryData.orgType}
                    onChange={(e) => setInquiryData({ ...inquiryData, orgType: e.target.value })}
                    class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-hidden bg-white"
                  >
                    <option value="Assisted Living Facility">Assisted Living Facility</option>
                    <option value="Retirement Home">Retirement Home</option>
                    <option value="Hospital / Healthcare System">Hospital / Healthcare System</option>
                    <option value="Home Care Agency">Home Care Agency</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-sm font-semibold text-slate-700">
                    {inquiry.fields.comments}
                  </label>
                  <textarea
                    name="needs"
                    rows={4}
                    placeholder={inquiry.fields.placeholderComments}
                    value={inquiryData.needs}
                    onChange={(e) => setInquiryData({ ...inquiryData, needs: e.target.value })}
                    class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  class="w-full py-4 rounded-xl bg-teal-600 text-white font-bold text-base hover:bg-teal-700 shadow-md transition-colors"
                >
                  {inquiry.cta}
                </button>

                <p class="text-xs text-center text-slate-600 pt-1">
                  {inquiry.footerNote}
                </p>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ─── SECTION 5: PARTNER CONTACT INFO ───────────────────────────────────────── */}
      <section id="partner-contact" class="py-12 bg-white border-t border-slate-200 text-slate-700 text-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-2">
            <Phone class="w-4 h-4 text-teal-600" />
            <span>{contact.phone}</span>
          </div>
          <div class="flex items-center space-x-2">
            <Mail class="w-4 h-4 text-teal-600" />
            <span>{contact.email}</span>
          </div>
          <div class="flex items-center space-x-2">
            <MapPin class="w-4 h-4 text-teal-600" />
            <span>{contact.address}</span>
          </div>
        </div>
      </section>

    </div>
  );
};
