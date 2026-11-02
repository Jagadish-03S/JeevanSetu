import React from 'react';
import { 
  FileCheck2, 
  Cpu, 
  Lock, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const HowItWorks = ({ currentLang, translations }) => {
  const t = translations[currentLang] || translations.en;

  const steps = [
    {
      num: "01",
      icon: FileCheck2,
      title: t.step1Title,
      desc: t.step1Desc,
      tag: "Verification First",
      details: "Requisitions must include treating hospital name, attending physician, and hospital requisition number."
    },
    {
      num: "02",
      icon: Cpu,
      title: t.step2Title,
      desc: t.step2Desc,
      tag: "Clinical Logic",
      details: "Filters accredited blood banks with matching component inventory and screens consenting voluntary donors."
    },
    {
      num: "03",
      icon: Lock,
      title: t.step3Title,
      desc: t.step3Desc,
      tag: "100% Confidential",
      details: "Donors receive private voluntary alerts. Contact details are never revealed without explicit double-opt-in."
    },
    {
      num: "04",
      icon: Stethoscope,
      title: t.step4Title,
      desc: t.step4Desc,
      tag: "Medical Safety",
      details: "Cross-matching and donor eligibility are strictly validated by hospital medical officers before donation."
    }
  ];

  return (
    <section id="how-it-works-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-crimson-800 mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ethical Coordination Standard</span>
          </div>
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight sm:text-4xl">
            {t.howItWorksTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            {t.howItWorksSubtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:border-crimson-200 hover:bg-red-50/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-700 bg-crimson-100/70 px-2.5 py-0.5 rounded-full border border-crimson-200">
                      {step.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white text-crimson-600 flex items-center justify-center shadow-xs mb-4 border border-slate-200/60">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-navy-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                  {step.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Essential Guardrails Box */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-navy-900 rounded-2xl p-6 sm:p-8 text-white shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Our Ethical Architecture & Regulatory Commitment</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Protecting Patients and Voluntary Donors at Every Step
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                JEEVANSETU never sells blood, charges patients for matching, or allows commercial blood brokers. In compliance with the National Blood Policy and Supreme Court rulings, all donations must be strictly voluntary and non-remunerated.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 justify-end">
              <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-xs">
                <div className="font-bold text-white mb-0.5">Zero Contact Leaks</div>
                <div className="text-slate-300 text-[11px]">Donor mobile numbers are never indexed or scraped.</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-xs">
                <div className="font-bold text-white mb-0.5">Verified Medical Officers</div>
                <div className="text-slate-300 text-[11px]">Only accredited hospital desks can confirm requisitions.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

