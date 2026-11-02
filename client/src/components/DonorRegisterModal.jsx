import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { KARNATAKA_DISTRICTS, BLOOD_GROUPS } from '../data/mockData';

export const DonorRegisterModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    bloodGroup: 'O+',
    district: 'Bengaluru Urban',
    approximateArea: '',
    phone: '',
    email: '',
    availability: 'Available',
    lastDonationDate: '',
    receiveAlerts: true,
    consentPrivacy: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.approximateArea) {
      setErrorMsg('Please fill in your name, contact phone, and approximate area.');
      return;
    }
    if (!formData.consentPrivacy) {
      setErrorMsg('You must affirm the privacy and voluntary donation consent to proceed.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
    if (onRegisterSuccess) {
      onRegisterSuccess(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        
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
              Welcome to the Voluntary Donor Roster!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{formData.fullName}</strong>. Your profile has been added to our privacy-protected donor registry for <strong>{formData.bloodGroup}</strong> in <strong>{formData.district}</strong>.
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy Safeguard Active</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Your phone number ({formData.phone.replace(/(\d{2})\d{4}(\d{4})/, '$1••••$2')}) will NEVER be displayed publicly. You will receive SMS/app alerts when a verified hospital in your area urgently needs your blood group.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 w-full py-2.5 bg-crimson-600 hover:bg-crimson-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              Done & Return to Platform
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900">
                  Voluntary Donor Registration
                </h3>
                <p className="text-xs text-slate-500">
                  Confidential & voluntary blood donor network
                </p>
              </div>
            </div>

            {/* Privacy Promise Banner */}
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 mb-5 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Zero Public Exposure:</span> Your contact information is kept strictly private. It is only shared if you explicitly accept a verified requisition.
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Screen Name <span className="text-crimson-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                />
              </div>

              {/* Blood Group & District */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group <span className="text-crimson-600">*</span>
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District / City <span className="text-crimson-600">*</span>
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

              {/* Approximate Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approximate Locality / Area <span className="text-crimson-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jayanagar 4th Block, Mysuru Road, etc."
                    value={formData.approximateArea}
                    onChange={(e) => setFormData({ ...formData, approximateArea: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Do not enter your exact house/flat number. Approximate landmark is sufficient for distance screening.
                </p>
              </div>

              {/* Confidential Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Private Mobile Number <span className="text-crimson-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="donor@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Availability Status
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Available', 'Temporarily Unavailable', 'Not Available'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, availability: status })}
                      className={`py-1.5 px-2 rounded-lg border font-medium transition text-center ${
                        formData.availability === status
                          ? 'bg-crimson-50 border-crimson-500 text-crimson-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {status === 'Available' ? '🟢 Available' : status === 'Temporarily Unavailable' ? '🟡 Busy/Resting' : '🔴 Inactive'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.consentPrivacy}
                    onChange={(e) => setFormData({ ...formData, consentPrivacy: e.target.checked })}
                    className="mt-0.5 rounded text-crimson-600 focus:ring-crimson-500 w-4 h-4 shrink-0"
                  />
                  <span className="leading-normal">
                    I understand this is a voluntary coordination platform. I agree to receive urgent donor alerts and affirm that my contact details will only be released with my explicit one-time consent.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-crimson-200 transition"
              >
                Register as Voluntary Donor
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

