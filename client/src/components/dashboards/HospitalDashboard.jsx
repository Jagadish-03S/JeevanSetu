import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Minus, 
  CheckCircle2, 
  FileCheck, 
  Users, 
  AlertCircle,
  Clock,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { MOCK_BLOOD_BANKS, MOCK_REQUESTS, BLOOD_GROUPS } from '../../data/mockData';

export const HospitalDashboard = ({ currentLang, translations }) => {
  const currentBank = MOCK_BLOOD_BANKS[0]; // Victoria Hospital Central Blood Bank
  const [inventory, setInventory] = useState(currentBank.inventory);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("Just now");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [requisitions, setRequisitions] = useState(MOCK_REQUESTS);

  const handleStockChange = (group, componentKey, delta) => {
    setInventory(prev => {
      const currentVal = prev[group]?.[componentKey] || 0;
      const newVal = Math.max(0, currentVal + delta);
      return {
        ...prev,
        [group]: {
          ...prev[group],
          [componentKey]: newVal
        }
      };
    });
  };

  const handlePublishInventory = () => {
    setLastUpdatedTime("Just now (Verified by Dr. Duty Officer)");
    setSaveSuccessMsg("Inventory successfully validated and published to Karnataka State Registry.");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const handleVerifyRequisition = (reqId) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: "Verified",
          verifiedBy: "Dr. Ananya Murthy (Duty Officer)"
        };
      }
      return r;
    }));
  };

  const handleFulfillFromStock = (reqId) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: "Fulfilled",
          medicalNote: "Fulfilled directly from BMCRI Central Blood Bank Reserve."
        };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Facility Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-crimson-50 text-crimson-600 flex items-center justify-center border border-crimson-100">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-navy-900">
                  {currentBank.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  CDSCO &amp; SBTC Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                License: {currentBank.licenseNumber} • {currentBank.hours} • Bangalore Medical College
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePublishInventory}
              className="bg-crimson-600 hover:bg-crimson-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Publish Verified Stock</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Blood Inventory Management Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h4 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-crimson-600" />
              Live Component Inventory Control
            </h4>
            <p className="text-xs text-slate-500">
              Only verified medical staff can update stock numbers. Displayed with recent timestamp.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
            Last Inventory Audit: <strong className="text-navy-900">{lastUpdatedTime}</strong>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-3">Blood Group</th>
                <th className="py-3 px-3 text-center">PRBC (Packed Cells)</th>
                <th className="py-3 px-3 text-center">Platelets (PRP/SDP)</th>
                <th className="py-3 px-3 text-center">FFP (Plasma)</th>
                <th className="py-3 px-3 text-center">Whole Blood</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {BLOOD_GROUPS.map(bg => {
                const stock = inventory[bg] || { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 };
                return (
                  <tr key={bg} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3">
                      <span className="font-extrabold text-navy-900 text-sm bg-slate-100 px-2 py-1 rounded">
                        {bg}
                      </span>
                    </td>

                    {/* PRBC Control */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => handleStockChange(bg, 'PRBC', -1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 font-bold text-navy-900">{stock.PRBC}</span>
                        <button
                          onClick={() => handleStockChange(bg, 'PRBC', 1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Platelets Control */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => handleStockChange(bg, 'Platelets', -1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 font-bold text-navy-900">{stock.Platelets}</span>
                        <button
                          onClick={() => handleStockChange(bg, 'Platelets', 1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* FFP Control */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => handleStockChange(bg, 'FFP', -1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 font-bold text-navy-900">{stock.FFP}</span>
                        <button
                          onClick={() => handleStockChange(bg, 'FFP', 1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Whole Blood Control */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => handleStockChange(bg, 'WholeBlood', -1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 font-bold text-navy-900">{stock.WholeBlood}</span>
                        <button
                          onClick={() => handleStockChange(bg, 'WholeBlood', 1)}
                          className="w-5 h-5 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Requisitions Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-crimson-600" />
              Incoming Patient Requisitions Review Queue
            </h4>
            <p className="text-xs text-slate-500">
              Validate requisition references and authorize emergency stock release or donor alerts
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {requisitions.map(req => (
            <div 
              key={req.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                    {req.id}
                  </span>
                  <span className="font-bold text-white bg-crimson-600 px-2 py-0.5 rounded text-[11px]">
                    {req.bloodGroup} ({req.unitsRequired} Units {req.component})
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    req.status === 'Fulfilled' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <div className="font-bold text-navy-900 text-sm">
                  {req.patientName} • {req.hospitalName}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Requisition ID: <code>{req.requisitionId}</code> • Needed: {req.requiredDateTime}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {req.status !== 'Fulfilled' && (
                  <>
                    <button
                      onClick={() => handleVerifyRequisition(req.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg border border-blue-200 transition"
                    >
                      Verify Requisition
                    </button>
                    <button
                      onClick={() => handleFulfillFromStock(req.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition"
                    >
                      Fulfill from Stock
                    </button>
                  </>
                )}
                {req.status === 'Fulfilled' && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Fulfilled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

