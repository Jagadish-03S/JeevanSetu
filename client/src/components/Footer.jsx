import React from 'react';
import { Heart, PhoneCall, ShieldCheck, Lock, ExternalLink, MapPin } from 'lucide-react';

export const Footer = ({ currentLang, translations }) => {
  const t = translations[currentLang] || translations.en;

  return (
    <footer className="bg-navy-950 text-white border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Emergency Contacts Bar */}
        <div className="bg-red-950/80 rounded-2xl p-5 border border-red-800/80 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-crimson-600 rounded-xl text-white">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-red-200">
                  Critical Emergency Helplines (India &amp; Karnataka)
                </div>
                <div className="text-sm font-semibold text-white">
                  Immediate emergency assistance is available 24/7 across all districts
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a 
                href="tel:112"
                className="bg-white text-navy-900 font-extrabold px-3 py-1.5 rounded-lg text-xs shadow hover:bg-slate-100 transition"
              >
                112 (National Emergency)
              </a>
              <a 
                href="tel:108"
                className="bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition"
              >
                108 (Ambulance)
              </a>
              <a 
                href="tel:104"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg text-xs border border-slate-700 transition"
              >
                104 (Karnataka Arogyavani)
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-crimson-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white stroke-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                JEEVANSETU
              </span>
              <span className="bg-emerald-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700">
                Karnataka Pilot
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An AI-assisted, privacy-preserving voluntary blood donor and blood bank coordination platform connecting patients, accredited facilities, and voluntary donors across Karnataka.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Zero Public Contact Disclosure
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                NBTC &amp; SBTC Compliant
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#search-banks-section" className="hover:text-white transition">Search Blood Banks</a></li>
              <li><a href="#how-it-works-section" className="hover:text-white transition">Coordination Workflow</a></li>
              <li><a href="#eligibility-section" className="hover:text-white transition">Donor Screening Guide</a></li>
              <li><a href="https://eraktkosh.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition inline-flex items-center gap-1">eRaktKosh Portal <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
            </ul>
          </div>

          {/* Pilot Locations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Pilot Coverage
            </h4>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Bengaluru Urban &amp; Rural</div>
              <div>Mysuru &amp; Mandya</div>
              <div>Hubballi-Dharwad</div>
              <div>Mangaluru (Dakshina Kannada)</div>
              <div>Belagavi &amp; Kalaburagi</div>
            </div>
          </div>

        </div>

        {/* Regulatory & Clinical Disclaimer */}
        <div className="border-t border-slate-800/80 pt-6 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong>IMPORTANT CLINICAL &amp; LEGAL DISCLAIMER:</strong> JEEVANSETU is an informational coordination and matching platform and is <strong>not</strong> an emergency ambulance dispatch service, transfusion authority, or blood testing laboratory. Blood compatibility, cross-matching, donor biological eligibility, infectious disease screening (including mandatory testing for HIV, HBV, HCV, Syphilis, and Malaria), and transfusion decisions are strictly performed by qualified healthcare professionals and licensed blood bank staff under the Drugs and Cosmetics Rules, 1945 and National Blood Transfusion Council (NBTC) regulations.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 pt-2 border-t border-slate-900 text-[11px]">
            <div>
              © 2026 JEEVANSETU Coordination Network. Open Source Pilot for Public Good.
            </div>
            <div className="mt-2 sm:mt-0 flex gap-4">
              <span>Privacy-First Architecture</span>
              <span>Non-Commercial Voluntary Donation</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

