import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Calendar, 
  Weight, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';

export const EligibilityChecker = ({ currentLang, translations, onRegisterClick }) => {
  const [age, setAge] = useState(24);
  const [weight, setWeight] = useState(60);
  const [gender, setGender] = useState("male");
  const [monthsSinceLast, setMonthsSinceLast] = useState(4);
  const [hasRecentHealthCondition, setHasRecentHealthCondition] = useState(false);
  const [hasRecentTattoo, setHasRecentTattoo] = useState(false);

  const t = translations[currentLang] || translations.en;

  // Screening logic based on NBTC Guidelines
  const isAgeValid = age >= 18 && age <= 65;
  const isWeightValid = weight >= 45;
  const minMonthsRequired = gender === 'female' ? 4 : 3;
  const isIntervalValid = monthsSinceLast >= minMonthsRequired;
  const isHealthClear = !hasRecentHealthCondition && !hasRecentTattoo;

  const isEligible = isAgeValid && isWeightValid && isIntervalValid && isHealthClear;

  return (
    <section id="eligibility-section" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>NBTC Guidelines Quick Assessment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {t.eligibilityTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            {t.eligibilitySubtitle}
          </p>
        </div>

        {/* Interactive Screening Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input 1: Age */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-crimson-600" />
                  Your Age: <strong className="text-navy-900">{age} years</strong>
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isAgeValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {isAgeValid ? 'Valid (18-65)' : 'Must be 18-65'}
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="75"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full accent-crimson-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>16 yrs</span>
                <span>18 yrs</span>
                <span>65 yrs</span>
                <span>75 yrs</span>
              </div>
            </div>

            {/* Input 2: Body Weight */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-crimson-600" />
                  Weight: <strong className="text-navy-900">{weight} kg</strong>
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isWeightValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {isWeightValid ? 'Valid (≥ 45 kg)' : 'Min 45 kg required'}
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="120"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full accent-crimson-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>35 kg</span>
                <span>45 kg</span>
                <span>80 kg</span>
                <span>120 kg</span>
              </div>
            </div>

            {/* Input 3: Gender & Interval */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="text-xs font-bold text-slate-700 mb-2">
                Gender & Last Donation Interval:
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    gender === 'male'
                      ? 'bg-crimson-600 text-white border-crimson-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Male (90 days interval)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    gender === 'female'
                      ? 'bg-crimson-600 text-white border-crimson-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Female (120 days interval)
                </button>
              </div>

              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-600">Months since last donation:</span>
                <strong className="text-navy-900">{monthsSinceLast} months</strong>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={monthsSinceLast}
                onChange={(e) => setMonthsSinceLast(parseInt(e.target.value))}
                className="w-full accent-crimson-600 cursor-pointer"
              />
            </div>

            {/* Input 4: Health Exclusions */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold text-slate-700 mb-1">
                Recent Health Conditions:
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={hasRecentHealthCondition}
                  onChange={(e) => setHasRecentHealthCondition(e.target.checked)}
                  className="rounded text-crimson-600 focus:ring-crimson-500 w-4 h-4"
                />
                <span>Active infection, fever, or antibiotics in past 7 days</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={hasRecentTattoo}
                  onChange={(e) => setHasRecentTattoo(e.target.checked)}
                  className="rounded text-crimson-600 focus:ring-crimson-500 w-4 h-4"
                />
                <span>Tattoo, major surgery, or piercing in past 6 months</span>
              </label>
            </div>

          </div>

          {/* Outcome Status Box */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {isEligible ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">
                  {isEligible 
                    ? 'Preliminary Assessment: Eligible for Voluntary Donation' 
                    : 'Cooling-off Period or Condition Identified'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEligible
                    ? 'You meet basic physical screening requirements. Register as an on-call voluntary donor.'
                    : 'Please wait until the required health interval passes before scheduling donation.'}
                </p>
              </div>
            </div>

            {isEligible && (
              <button
                onClick={onRegisterClick}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                Join Voluntary Roster Now
              </button>
            )}
          </div>

          {/* Mandatory NBTC Disclaimer */}
          <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Regulatory Disclaimer:</strong> This screening tool is an informational checklist only and does not constitute medical clearance. In accordance with Ministry of Health regulations, blood bank medical officers perform mandatory pre-donation hemoglobin, blood pressure, and infectious disease screening (HIV, Hepatitis B, Hepatitis C, Syphilis, and Malaria) prior to every blood collection.
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

