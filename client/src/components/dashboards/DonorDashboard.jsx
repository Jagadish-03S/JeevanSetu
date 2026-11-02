import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Bell, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lock, 
  Award,
  PhoneCall,
  User,
  AlertTriangle
} from 'lucide-react';
import { MOCK_REQUESTS } from '../../data/mockData';

export const DonorDashboard = ({ currentLang, translations }) => {
  const [donorStatus, setDonorStatus] = useState("Available");
  const [receiveAlerts, setReceiveAlerts] = useState(true);
  const [acceptedRequests, setAcceptedRequests] = useState({});

  // Matched mock request for this donor (O- / B-)
  const incomingRequests = MOCK_REQUESTS.filter(r => r.status !== 'Fulfilled');

  const handleAcceptRequest = (requestId) => {
    setAcceptedRequests(prev => ({
      ...prev,
      [requestId]: true
    }));
  };

  const handleDeclineRequest = (requestId) => {
    setAcceptedRequests(prev => ({
      ...prev,
      [requestId]: false
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Donor Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-crimson-600 to-red-500 text-white flex flex-col items-center justify-center shadow-md">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Type</span>
              <span className="text-xl font-extrabold leading-tight">O-</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-navy-900">
                  Kiran R. (Voluntary Donor #401)
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Roster
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Jayanagar 4th Block, Bengaluru Urban</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">Screened Healthy</span>
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 px-2">Status:</span>
            {['Available', 'Temporarily Unavailable', 'Not Available'].map(s => (
              <button
                key={s}
                onClick={() => setDonorStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                  donorStatus === s
                    ? 'bg-crimson-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {s === 'Available' ? '🟢 Available' : s === 'Temporarily Unavailable' ? '🟡 Busy / Resting' : '🔴 Inactive'}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy & Notification Settings Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>
              Your phone (+91 98•••• 1209) is <strong>fully confidential</strong>. Only released upon your explicit acceptance.
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={receiveAlerts}
              onChange={(e) => setReceiveAlerts(e.target.checked)}
              className="rounded text-crimson-600 focus:ring-crimson-500 w-4 h-4"
            />
            <span>Receive voluntary emergency notifications</span>
          </label>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-crimson-50 text-crimson-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-900">6 Units</div>
            <div className="text-xs text-slate-500">Lifetime Voluntary Donations</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-navy-900">~18 Lives</div>
            <div className="text-xs text-slate-500">Estimated Patients Impacted</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Eligible Now</div>
            <div className="text-xs text-slate-500">Last donated: 15 July 2026 (&gt; 90 days)</div>
          </div>
        </div>
      </div>

      {/* Incoming Verified Coordination Requests */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-crimson-600 animate-bounce" />
              Incoming Verified Requisitions in Your Area
            </h4>
            <p className="text-xs text-slate-500">
              Only verified medical requisitions matching your O- blood group are shown
            </p>
          </div>
          <span className="text-xs font-semibold bg-crimson-50 text-crimson-700 px-3 py-1 rounded-full border border-crimson-200">
            {incomingRequests.length} Active Request
          </span>
        </div>

        <div className="space-y-4">
          {incomingRequests.map(req => {
            const isAccepted = acceptedRequests[req.id] === true;
            const isDeclined = acceptedRequests[req.id] === false;

            return (
              <div 
                key={req.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white bg-crimson-600 px-2.5 py-0.5 rounded">
                        {req.bloodGroup} Needed
                      </span>
                      <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {req.component} ({req.unitsRequired} Units)
                      </span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {req.urgency}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-navy-900">
                      {req.hospitalName} ({req.district})
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Requisition: <code className="text-slate-700">{req.requisitionId}</code> • Verified by: {req.verifiedBy}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <strong>Clinical Context:</strong> {req.medicalNote}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 block">Needed:</span>
                    <strong className="text-xs text-navy-900">{req.requiredDateTime}</strong>
                  </div>
                </div>

                {/* Consent-Based Decision Action */}
                <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {isAccepted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <strong>Consent Granted!</strong> Your contact details have been safely released to Victoria Hospital Blood Desk.
                        </div>
                      </div>
                      <a 
                        href="tel:18004254422" 
                        className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 hover:bg-emerald-700"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Coordinator</span>
                      </a>
                    </div>
                  ) : isDeclined ? (
                    <div className="text-xs text-slate-400 italic">
                      You declined this request. Your contact remains fully private.
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Accepting releases your contact ONLY to this verified hospital desk.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-crimson-600 hover:bg-crimson-700 rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Accept &amp; Share Contact</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

