import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Lock,
  Search,
  ExternalLink
} from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';

export const AdminDashboard = ({ currentLang, translations }) => {
  const [pendingFacilities, setPendingFacilities] = useState([
    {
      id: "fac-new-1",
      name: "Belagavi Institute of Medical Sciences (BIMS) Blood Centre",
      district: "Belagavi",
      licenseNumber: "KA-BG-05182/SBTC",
      submittedDate: "Today, 11:40 AM",
      officer: "Dr. Vinayak Patil",
      status: "Verification Pending"
    },
    {
      id: "fac-new-2",
      name: "Shivamogga McGann District Teaching Hospital Blood Bank",
      district: "Shivamogga",
      licenseNumber: "KA-SM-02109/SBTC",
      submittedDate: "Yesterday",
      officer: "Dr. Sudha Rao",
      status: "Verification Pending"
    }
  ]);

  const [abuseFlags, setAbuseFlags] = useState([
    {
      id: "flag-01",
      severity: "Medium",
      reason: "Duplicate Contact Across Different Hospital Claims",
      details: "Same mobile (+91 9900•• 4411) used for 2 requisitions in different districts within 3 hours.",
      flaggedBy: "AI Pattern Screening Filter",
      status: "Under Review"
    }
  ]);

  const handleApproveFacility = (id) => {
    setPendingFacilities(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Pilot Admin Notice */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-crimson-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Admin Console
              </span>
              <span className="text-amber-400 text-xs font-semibold">
                DEMO PILOT DATA (Karnataka State Transfusion Coordination)
              </span>
            </div>
            <h3 className="text-xl font-bold">
              JeevanSetu Platform Administration &amp; Governance
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Audit trail, license verification queue, and privacy enforcement
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Voluntary Donors</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-navy-900">1,420</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% Privacy Consented</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Accredited Facilities</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-navy-900">84</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 10 Pilot Districts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Fulfilled Requests</span>
            <CheckCircle2 className="w-4 h-4 text-crimson-600" />
          </div>
          <div className="text-2xl font-extrabold text-navy-900">342</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero Transfusion Incidents</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Pending Audits</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{pendingFacilities.length}</div>
          <div className="text-[11px] text-amber-600 mt-1">Awaiting License Inspection</div>
        </div>
      </div>

      {/* Facility Verification Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h4 className="text-base font-bold text-navy-900 mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Accredited Blood Centre Verification Queue ({pendingFacilities.length})
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Confirm CDSCO &amp; SBTC medical license before authorizing blood bank inventory publishing
        </p>

        {pendingFacilities.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
            ✓ All facility applications are inspected and approved.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingFacilities.map(fac => (
              <div 
                key={fac.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-navy-900">{fac.name}</span>
                    <span className="bg-blue-50 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded border border-blue-200">
                      {fac.licenseNumber}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    District: <strong>{fac.district}</strong> • Medical Officer: {fac.officer} • Submitted: {fac.submittedDate}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApproveFacility(fac.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                  >
                    Approve &amp; Grant Access
                  </button>
                  <button
                    onClick={() => handleApproveFacility(fac.id)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition"
                  >
                    Request Documents
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Pattern Screening & Abuse Prevention */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h4 className="text-base font-bold text-navy-900 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          AI Pattern Screening &amp; Duplicate Detection
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Heuristic screening flags duplicate patient requisitions or unauthorized donor scraping attempts
        </p>

        <div className="space-y-3">
          {abuseFlags.map(flag => (
            <div key={flag.id} className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">{flag.reason}</span>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                  {flag.severity} Risk
                </span>
              </div>
              <p className="text-amber-800 text-[11px]">{flag.details}</p>
              <div className="flex justify-between items-center pt-2 border-t border-amber-200/60 text-[10px] text-amber-700">
                <span>Flagged by: {flag.flaggedBy}</span>
                <button 
                  onClick={() => setAbuseFlags([])} 
                  className="font-bold underline hover:text-amber-900"
                >
                  Mark Reviewed &amp; Clear
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h4 className="text-base font-bold text-navy-900 mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5 text-crimson-600" />
          Regulatory Audit Trail &amp; Consent Ledger
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Immutable event log for patient safety, donor consent disclosures, and inventory modifications
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Target / Detail</th>
                <th className="py-2.5 px-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_AUDIT_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-bold text-navy-900 font-mono text-[11px]">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-700">{log.actor}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.target}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

