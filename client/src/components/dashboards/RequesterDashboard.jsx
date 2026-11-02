import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  PhoneCall, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  ExternalLink
} from 'lucide-react';
import { MOCK_REQUESTS, MOCK_BLOOD_BANKS } from '../../data/mockData';

export const RequesterDashboard = ({ currentLang, translations, onNewRequestClick }) => {
  const currentReq = MOCK_REQUESTS[0]; // REQ-2026-KA-01

  const allStages = [
    "Submitted",
    "Verification Pending",
    "Verified",
    "Matching in Progress",
    "Donor Response Received",
    "Referred to Blood Bank",
    "Fulfilled"
  ];

  const currentStageIndex = allStages.indexOf(currentReq.status);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Emergency Notice */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Active Patient Care Advisory:</span> Please maintain continuous communication with the attending medical team at <strong>{currentReq.hospitalName}</strong>. If immediate resuscitation or O-negative emergency release is needed, casualty medical officers can authorize emergency trauma reserves.
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <a href="tel:112" className="bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-lg">112</a>
          <a href="tel:108" className="bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-lg">108</a>
        </div>
      </div>

      {/* Main Request Progress Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-crimson-600 text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded">
                {currentReq.id}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded">
                Verified Medical Requisition
              </span>
            </div>
            <h3 className="text-xl font-bold text-navy-900">
              Patient: {currentReq.patientName} ({currentReq.age} yrs, {currentReq.gender})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentReq.hospitalName}</span>
              <span className="text-slate-300">•</span>
              <span>Requisition ID: <code>{currentReq.requisitionId}</code></span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-crimson-600">
              {currentReq.bloodGroup}
            </div>
            <div className="text-xs font-bold text-slate-700">
              {currentReq.unitsRequired} Units ({currentReq.component})
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              {currentReq.urgency}
            </div>
          </div>
        </div>

        {/* 8-Stage Visual Progress Tracker */}
        <div className="py-8">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
            Coordination Lifecycle Progress:
          </h4>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {allStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div 
                  key={stage}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-crimson-50 border-crimson-500 ring-2 ring-crimson-200 shadow-xs'
                      : isPast
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1.5">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="w-4 h-4 rounded-full bg-crimson-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {idx + 1}
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div className={`text-[11px] font-bold leading-tight ${isCurrent ? 'text-crimson-800' : isPast ? 'text-emerald-800' : 'text-slate-500'}`}>
                    {stage}
                  </div>
                  {isCurrent && (
                    <span className="inline-block mt-1 bg-crimson-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Coordination Telemetry Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Medical Verification</span>
            </div>
            <div className="font-bold text-navy-900">{currentReq.verifiedBy}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Confirmed via Victoria Hospital Casualty Desk</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Voluntary Matching</span>
            </div>
            <div className="font-bold text-navy-900">
              {currentReq.acceptedDonorsCount} Donors Accepted (3 Notified)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Consent granted to hospital blood officer</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Target Timeline</span>
            </div>
            <div className="font-bold text-navy-900">{currentReq.requiredDateTime}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Cross-matching underway in lab</div>
          </div>
        </div>

      </div>

      {/* Suggested Accredited Blood Centres with Stock */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h4 className="text-base font-bold text-navy-900 mb-1 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-crimson-600" />
          Accredited Blood Centres with Potential Inventory Nearby
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Contact these accredited centres directly with your requisition number ({currentReq.requisitionId})
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_BLOOD_BANKS.slice(0, 2).map(bank => (
            <div key={bank.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-navy-900">{bank.name}</h5>
                  <p className="text-slate-500 text-[11px]">{bank.address}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Verified
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200/80">
                <span className="text-slate-600">Reported O- PRBC: <strong>{bank.inventory['O-']?.PRBC || 0} Units</strong></span>
                <a 
                  href={`tel:${bank.phone}`}
                  className="bg-crimson-600 text-white font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 hover:bg-crimson-700"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {bank.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
