import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  FileText, 
  AlertCircle,
  KeyRound,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('donor');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register({ email, password, full_name: fullName, role });
      } else {
        await login(email, password);
      }
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('JeevanSetu@2026');
    setIsRegisterMode(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-600 flex items-center justify-center">
            {isRegisterMode ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-900">
              {isRegisterMode ? 'Create JEEVANSETU Account' : 'Portal Sign In'}
            </h3>
            <p className="text-xs text-slate-500">
              Role-based secure access for healthcare coordination
            </p>
          </div>
        </div>

        {/* Demo Accounts Quick-Fill Pill Bar */}
        {!isRegisterMode && (
          <div className="mb-5 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Instant Demo Fill:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@jeevansetu.in', 'admin')}
                className="p-1.5 text-left bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition text-[11px] font-semibold text-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Platform Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('victoria.desk@bmcri.edu.in', 'hospital')}
                className="p-1.5 text-left bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition text-[11px] font-semibold text-slate-700"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Hospital / Bank Desk</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('donor.kiran@example.com', 'donor')}
                className="p-1.5 text-left bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition text-[11px] font-semibold text-slate-700"
              >
                <UserCheck className="w-3.5 h-3.5 text-crimson-600 shrink-0" />
                <span className="truncate">Voluntary Donor</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('patient.prakash@example.com', 'requester')}
                className="p-1.5 text-left bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition text-[11px] font-semibold text-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Patient / Requester</span>
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Rao"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@organization.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-crimson-500 focus:outline-none"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-crimson-500 focus:outline-none"
              >
                <option value="donor">Voluntary Donor</option>
                <option value="requester">Patient / Requester</option>
                <option value="hospital">Hospital Staff</option>
                <option value="bloodbank">Verified Blood Bank</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-crimson-600 hover:bg-crimson-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition"
          >
            {loading ? 'Processing...' : isRegisterMode ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          {isRegisterMode ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorMsg('');
                }}
                className="font-bold text-crimson-600 hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorMsg('');
                }}
                className="font-bold text-crimson-600 hover:underline"
              >
                Register Here
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

