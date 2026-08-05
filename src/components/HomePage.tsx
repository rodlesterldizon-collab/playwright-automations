import React, { useState } from 'react';
import { CmsHomeData } from '../types';
import { ShieldCheck, Heart, UserCheck, Clock, Award, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  data: CmsHomeData;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onNavigate }) => {
  const { hero, stats, about, services, contact } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    typeOfCare: 'In-Home Care',
    helpDescription: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleHireClick = () => {
    window.location.hash = '#contact';
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServicesClick = () => {
    window.location.hash = '#services';
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.phone || !formData.helpDescription) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const json = await res.json();
        setErrorMessage(json.error || 'Failed to submit request.');
      }
    } catch {
      setErrorMessage('Network error while submitting form.');
    }
  };

  return (
    <div class="space-y-0">
      
      {/* ─── SECTION 1: HERO SECTION ──────────────────────────────────────────────── */}
      <section id="hero" class="relative bg-gradient-to-b from-teal-50/60 via-slate-50 to-white pt-16 pb-20 md:pt-24 md:pb-28">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl space-y-6">
            <span class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold tracking-wide uppercase border border-teal-200">
              <ShieldCheck class="w-3.5 h-3.5 text-teal-700" />
              <span>{hero.badge}</span>
            </span>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif">
              <span>{hero.titlePrefix}</span>
            </h1>

            <p class="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              {hero.description}
            </p>

            <div class="pt-4 flex flex-wrap gap-4">
              <button
                id="hero-hire-cta"
                onClick={handleHireClick}
                class="px-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 shadow-md hover:shadow-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                {hero.ctaHire}
              </button>

              <button
                id="hero-services-cta"
                onClick={handleServicesClick}
                class="px-6 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-300 hover:bg-slate-50 shadow-xs transition-all"
              >
                {hero.ctaServices}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: STATS GRID SECTION ────────────────────────────────────────── */}
      <section id="stats" class="bg-white border-y border-slate-200/80 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.items.map((item, idx) => (
              <div key={idx} class="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 text-center space-y-1">
                <span class="block text-3xl sm:text-4xl font-extrabold text-teal-700 font-serif">
                  {item.value}
                </span>
                <span class="block text-sm font-medium text-slate-600">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: ABOUT / MISSION SECTION ───────────────────────────────────── */}
      <section id="about" class="py-20 bg-slate-50/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image Block */}
            <div class="lg:col-span-5">
              <picture class="block rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-teal-900/10 aspect-4/3 relative">
                <img
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                  alt="CompassionCare Caregiver assisting senior"
                  class="w-full h-full object-cover"
                />
              </picture>
            </div>

            {/* Content Block */}
            <div class="lg:col-span-7 space-y-6">
              <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
                {about.title}
              </h2>
              <p class="text-base sm:text-lg text-slate-600 leading-relaxed">
                {about.description}
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {about.features.map((feature, idx) => (
                  <div key={idx} class="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs space-y-2">
                    <div class="flex items-center space-x-3">
                      <div class="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        {idx === 0 && <UserCheck class="w-5 h-5" />}
                        {idx === 1 && <Clock class="w-5 h-5" />}
                        {idx === 2 && <Heart class="w-5 h-5" />}
                        {idx === 3 && <Award class="w-5 h-5" />}
                      </div>
                      <h4 class="text-base font-bold text-slate-900">
                        {feature.title}
                      </h4>
                    </div>
                    <p class="text-sm text-slate-600 leading-normal pl-12">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 4: SERVICES GRID ─────────────────────────────────────────────── */}
      <section id="services" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
              {services.title}
            </h2>
            <p class="text-base sm:text-lg text-slate-600">
              {services.description}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.items.map((item, idx) => (
              <div key={idx} class="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between hover:border-teal-300 transition-colors">
                <div class="space-y-4">
                  <h3 class="text-xl font-bold text-slate-900 font-serif">
                    {item.title}
                  </h3>
                  <p class="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  {item.highlights && (
                    <div class="pt-2 flex flex-wrap gap-1.5">
                      {item.highlights.map((h, hIdx) => (
                        <span key={hIdx} class="px-2.5 py-1 rounded-md bg-teal-100/70 text-teal-800 text-xs font-semibold">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div class="pt-6">
                  <button
                    onClick={handleHireClick}
                    class="w-full py-2.5 px-4 rounded-xl bg-white text-teal-700 font-semibold text-sm border border-slate-200 hover:bg-teal-50 transition-colors"
                  >
                    {item.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 5: CONTACT / CONSULTATION FORM SECTION ───────────────────────── */}
      <section id="contact" class="py-20 bg-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Info Sidebar */}
            <div class="lg:col-span-5 space-y-6">
              <h2 class="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                {contact.title}
              </h2>
              <p class="text-slate-300 text-base leading-relaxed">
                Reach out to our care coordination team today. We provide free in-home assessments and personalized care plan estimates.
              </p>

              <div class="space-y-4 pt-4">
                <div class="flex items-center space-x-3 text-slate-200">
                  <Phone class="w-5 h-5 text-teal-400 shrink-0" />
                  <span class="text-base font-medium">{contact.contactInfo.phone}</span>
                </div>

                <div class="flex items-center space-x-3 text-slate-200">
                  <Mail class="w-5 h-5 text-teal-400 shrink-0" />
                  <span class="text-base font-medium">{contact.contactInfo.email}</span>
                </div>

                <div class="flex items-start space-x-3 text-slate-200">
                  <MapPin class="w-5 h-5 text-teal-400 shrink-0 mt-1" />
                  <span class="text-base font-medium">{contact.contactInfo.address}</span>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div class="lg:col-span-7 bg-white text-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
              {formSubmitted ? (
                <div class="py-12 text-center space-y-4">
                  <div class="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 class="w-10 h-10" />
                  </div>
                  <h3 class="text-2xl font-bold font-serif text-slate-900">
                    {contact.form.successMessage.title}
                  </h3>
                  <p class="text-slate-600 max-w-md mx-auto">
                    {contact.form.successMessage.description}
                  </p>
                  <button
                    onClick={() => { setFormSubmitted(false); setFormData({ name: '', email: '', phone: '', typeOfCare: 'In-Home Care', helpDescription: '' }); }}
                    class="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} class="space-y-5">
                  {errorMessage && (
                    <div class="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
                      {errorMessage}
                    </div>
                  )}

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                      <label class="block text-sm font-semibold text-slate-700">
                        {contact.form.labels.name}
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder={contact.form.placeholders.name}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-hidden"
                      />
                    </div>

                    <div class="space-y-1.5">
                      <label class="block text-sm font-semibold text-slate-700">
                        {contact.form.labels.email}
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder={contact.form.placeholders.email}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-hidden"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                      <label class="block text-sm font-semibold text-slate-700">
                        {contact.form.labels.phone}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={contact.form.placeholders.phone}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-hidden"
                      />
                    </div>

                    <div class="space-y-1.5">
                      <label class="block text-sm font-semibold text-slate-700">
                        {contact.form.labels.typeOfCare}
                      </label>
                      <select
                        name="typeOfCare"
                        value={formData.typeOfCare}
                        onChange={(e) => setFormData({ ...formData, typeOfCare: e.target.value })}
                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-hidden bg-white"
                      >
                        <option value="In-Home Care">In-Home Care</option>
                        <option value="Nursing Care">Nursing Care</option>
                        <option value="Companionship">Companionship</option>
                        <option value="Memory Support">Memory Support</option>
                        <option value="Specialized Dementia Care">Specialized Dementia Care</option>
                      </select>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-slate-700">
                      {contact.form.labels.helpDescription}
                    </label>
                    <textarea
                      name="helpDescription"
                      rows={4}
                      placeholder={contact.form.placeholders.helpDescription}
                      value={formData.helpDescription}
                      onChange={(e) => setFormData({ ...formData, helpDescription: e.target.value })}
                      class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    class="w-full py-4 rounded-xl bg-teal-600 text-white font-bold text-base hover:bg-teal-700 shadow-md transition-colors"
                  >
                    {contact.form.cta}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
