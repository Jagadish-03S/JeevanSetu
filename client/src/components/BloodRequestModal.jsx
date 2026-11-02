import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  FileUp, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { KARNATAKA_DISTRICTS, BLOOD_GROUPS, BLOOD_COMPONENTS } from '../data/mockData';

export const BloodRequestModal = ({ isOpen, onClose, onRequestSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    hospitalName: '',
    district: 'Bengaluru Urban',
    bloodGroup: 'O+',
    component: 'Packed Red Blood Cells (PRBC)',
    unitsRequired: 2,
    urgency: 'Urgent (< 12 hrs)',
    requiredDateTime: '',
    requisitionId: '',
    requesterName: '',
    requesterPhone: '',
    requesterRelation: 'Attending Physician',
    medicalNote: '',
    uploadedDocName: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.hospitalName || !formData.requesterPhone || !formData.requisitionId) {
      setErrorMsg('Please complete all required fields including hospital and requisition number.');
      return;
    }

    const newId = `REQ-2026-KA-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedRequestId(newId);
    setErrorMsg('');
    setSubmitted(true);

    if (onRequestSuccess) {
      onRequestSuccess({ ...formData, id: newId });
    }
  };

  const handleFakeFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, uploadedDocName: e.target.files[0].name });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">
              Blood Assistance Requisition Logged
            </h3>
            <div className="inline-block bg-slate-100 text-slate-800 font-mono text-xs px-3 py-1 rounded-md mt-2 font-bold">
              Tracking ID: {createdRequestId}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
              Your request for <strong>{formData.unitsRequired} units of {formData.bloodGroup} ({formData.component})</strong> at <strong>{formData.hospitalName}</strong> has been submitted.
            </p>

            <div className="mt-5 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Next Step: Clinical Desk Verification</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                To prevent fraudulent broadcasts, a JeevanSetu coordinator or the hospital blood centre will verify Requisition <strong>#{formData.requisitionId}</strong> before broadcasting alerts to matching voluntary donors.
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-amber-900 text-[11px] font-semibold">
                ⚠️ Emergency Reminder: In acute crises, immediately instruct the hospital blood bank to initiate emergency release protocols or call 112/108.
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 w-full py-2.5 bg-crimson-600 hover:bg-crimson-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              Close & View Live Status
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">
                  Request Blood Assistance
                </h3>
                <p className="text-xs text-slate-500">
                  Submit verified requisition for hospital blood coordination
                </p>
              </div>
            </div>

            {/* Emergency Alert Callout */}
            <div className="bg-red-50 rounded-xl p-3 border border-red-200 mb-5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-crimson-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-900 leading-normal">
                <span className="font-bold">Life-Threatening Emergency Notice:</span> If the patient is in acute hemorrhagic shock, please notify hospital casualty staff immediately and call <span className="font-bold underline">112 / 108</span>. JeevanSetu assists coordination and does not replace emergency blood bank issue.
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* Patient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Name <span className="text-crimson-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age & Gender
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-16 px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                    />
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="flex-1 px-1 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hospital Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital Name & Ward <span className="text-crimson-600">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victoria Hospital, ICU 2"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital District <span className="text-crimson-600">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  >
                    {KARNATAKA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Blood Group, Component & Units */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group <span className="text-crimson-600">*</span>
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-bold text-crimson-700 focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Units <span className="text-crimson-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.unitsRequired}
                    onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-bold focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency Tier <span className="text-crimson-600">*</span>
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-navy-900 focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  >
                    <option value="Critical Emergency (< 4 hrs)">Critical (&lt; 4 hrs)</option>
                    <option value="Urgent (< 12 hrs)">Urgent (&lt; 12 hrs)</option>
                    <option value="Standard (Scheduled)">Standard (24+ hrs)</option>
                  </select>
                </div>
              </div>

              {/* Component */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Component Requested
                </label>
                <select
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                >
                  {BLOOD_COMPONENTS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Medical Requisition Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Doctor / Hospital Requisition ID <span className="text-crimson-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VH-REQ-2026/890"
                    value={formData.requisitionId}
                    onChange={(e) => setFormData({ ...formData, requisitionId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-mono focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Found on the hospital blood requisition slip</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requester Phone <span className="text-crimson-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.requesterPhone}
                      onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Supporting Document Upload Mockup */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Requisition Form / Prescription (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300">
                    <FileUp className="w-3.5 h-3.5 text-slate-600" />
                    <span>Choose File (PDF/Image)</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleFakeFileUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-500 truncate max-w-xs">
                    {formData.uploadedDocName || 'No file selected (Optional)'}
                  </span>
                </div>
              </div>

              {/* Verification Protocol Notice */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  By submitting, you confirm that this request is made under genuine medical guidance. All requests undergo phone or digital verification with the treating facility.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-crimson-200 transition"
              >
                Submit Requisition for Verification
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
