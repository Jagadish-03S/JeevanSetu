import React from 'react';
import { 
  Heart, 
  Search, 
  UserPlus, 
  FilePlus, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Building2, 
  Activity, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const HeroSection = ({ 
  currentLang, 
  translations, 
  onSearchClick, 
  onDonorClick, 
  onRequestClick 
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-red-50/70 via-slate-50 to-white pt-8 pb-16 border-b border-slate-200">
      
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fee2e2_1px,transparent_1px),linear-gradient(to_bottom,#fee2e2_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-crimson-100/80 text-crimson-800 border border-crimson-200 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-crimson-600" />
            Karnataka Pilot Initiative
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Lock className="w-3 h-3 text-slate-500" />
            Consent-Gated & Zero Public Phone Exposure
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            NBTC & SBTC Guidelines Aligned
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight">
            {t.heroTitle.split('.')[0]}.<br />
            <span className="bg-gradient-to-r from-crimson-600 via-red-600 to-rose-700 bg-clip-text text-transparent">
              {t.heroTitle.split('.')[1] || 'Every Life Matters.'}
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Critical Coordination Disclaimer Callout */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 text-xs text-left max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Protocol:</strong> JeevanSetu coordinates information between verified stakeholders. Compatibility, donor health screening, and transfusion authorizations are strictly validated by certified hospital pathologists.
            </span>
          </div>
        </div>

        {/* 3 Primary Action Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          
          {/* Card 1: Search Blood Banks */}
          <div 
            onClick={onSearchClick}
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-crimson-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-crimson-50 text-crimson-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 group-hover:text-crimson-600 transition-colors">
                {t.findBloodBanks}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-normal">
                Search verified blood centres by district, view recent component inventory reports, and find direct emergency desk hotlines.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-crimson-600">
              <span>Explore 84 Facilities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Register as Donor */}
          <div 
            onClick={onDonorClick}
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 group-hover:text-emerald-700 transition-colors">
                {t.becomeDonor}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-normal">
                Join our privacy-first voluntary donor registry. Your contact details remain confidential and are only shared with your explicit consent.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Join Voluntary Roster</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Request Blood Assistance */}
          <div 
            onClick={onRequestClick}
            className="group relative bg-gradient-to-br from-crimson-600 to-rose-700 text-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:from-crimson-700 hover:to-rose-800 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FilePlus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {t.requestBlood}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-red-100 leading-normal">
                Submit a verified requisition for patients needing PRBC, platelets, or whole blood. Our coordination engine alerts nearby eligible donors and banks.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-white">
              <span>Initiate Verified Requisition</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Pilot Platform Impact Counters (Labelled DEMO) */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-crimson-500" />
              Pilot Live Coordination Telemetry
            </span>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {t.demoNotice}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                1,420<span className="text-crimson-600">+</span>
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">
                Verified Voluntary Donors
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                84
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">
                Accredited Blood Banks
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                342
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">
                Requests Successfully Coordinated
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                18 <span className="text-sm font-semibold text-slate-500">mins</span>
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">
                Avg. Coordinator Match Speed
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
