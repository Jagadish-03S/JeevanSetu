import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, ShieldCheck, X } from 'lucide-react';

export const EmergencyBanner = ({ currentLang, translations }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const t = translations[currentLang] || translations.en;

  if (isDismissed) {
    return (
      <div className="bg-red-900 text-white text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-red-200">Emergency Helpline:</span>
          <span className="font-bold underline">112</span> (National Emergency) | <span className="font-bold underline">108</span> (Ambulance)
        </div>
        <button 
          onClick={() => setIsDismissed(false)} 
          className="text-red-200 hover:text-white underline text-[11px]"
        >
          View Full Notice
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-700 via-crimson-600 to-red-800 text-white shadow-sm border-b border-red-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <span className="p-1 bg-white/20 rounded-full mt-0.5 shrink-0 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-white" />
            </span>
            <div className="text-xs sm:text-sm">
              <span className="font-bold tracking-wide text-white uppercase mr-2 bg-red-900/60 px-1.5 py-0.5 rounded text-[10px]">
                Urgent Medical Notice
              </span>
              <span>{t.emergencyAlert}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <a 
              href="tel:112"
              className="inline-flex items-center gap-1.5 bg-white text-crimson-700 font-bold px-3 py-1 rounded-full text-xs shadow hover:bg-red-50 transition"
              title="Call National Emergency 112"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 112</span>
            </a>
            <a 
              href="tel:108"
              className="inline-flex items-center gap-1.5 bg-red-900/80 hover:bg-red-900 text-white font-medium px-2.5 py-1 rounded-full text-xs border border-white/20 transition"
              title="Call Ambulance 108"
            >
              <span>108 (Ambulance)</span>
            </a>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              aria-label="Collapse alert banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

