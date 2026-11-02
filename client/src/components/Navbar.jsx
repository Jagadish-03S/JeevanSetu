import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  UserPlus, 
  FileText, 
  ShieldCheck, 
  Globe, 
  Menu, 
  X, 
  UserCheck, 
  Building, 
  Building2, 
  LayoutDashboard,
  HelpCircle,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ 
  currentLang, 
  setCurrentLang, 
  translations, 
  activeRole, 
  setActiveRole,
  activeView,
  setActiveView,
  onOpenDonorModal,
  onOpenRequestModal,
  onOpenLoginModal
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang] || translations.en;

  const roleIcons = {
    visitor: Globe,
    donor: UserCheck,
    requester: FileText,
    hospital: Building,
    bloodbank: Building2,
    admin: ShieldCheck
  };

  const ActiveRoleIcon = roleIcons[activeRole] || Globe;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveView('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-crimson-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-crimson-200">
              <Heart className="w-6 h-6 fill-white stroke-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-navy-900">
                  {t.appName}
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  KA Pilot
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Blood Coordination & Verified Donors
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-crimson-600 transition ${activeView === 'home' ? 'text-crimson-600 font-semibold' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveView('home');
                const el = document.getElementById('search-banks-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-crimson-600 transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{t.findBloodBanks}</span>
            </button>
            <button
              onClick={() => {
                setActiveView('home');
                const el = document.getElementById('how-it-works-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-crimson-600 transition"
            >
              Workflow
            </button>
            <button
              onClick={() => {
                setActiveView('home');
                const el = document.getElementById('eligibility-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-crimson-600 transition"
            >
              Eligibility Guide
            </button>

            {/* Quick dashboard tab if role != visitor */}
            {activeRole !== 'visitor' && (
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition text-xs font-semibold ${
                  activeView === 'dashboard' 
                    ? 'bg-crimson-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>My Dashboard</span>
              </button>
            )}
          </div>

          {/* Right Actions: Lang Switcher + Role Selector + Primary CTAs */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setCurrentLang('en')}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentLang === 'en' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setCurrentLang('kn')}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentLang === 'kn' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setCurrentLang('hi')}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentLang === 'hi' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <label htmlFor="role-select" className="sr-only">Select Role</label>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700">
                <ActiveRoleIcon className="w-3.5 h-3.5 text-crimson-600" />
                <select
                  id="role-select"
                  value={activeRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setActiveRole(newRole);
                    if (newRole !== 'visitor') {
                      setActiveView('dashboard');
                    }
                  }}
                  className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer text-slate-800"
                >
                  <option value="visitor">Visitor Mode</option>
                  <option value="donor">Voluntary Donor</option>
                  <option value="requester">Patient / Requester</option>
                  <option value="hospital">Hospital Staff</option>
                  <option value="bloodbank">Verified Blood Bank</option>
                  <option value="admin">Platform Admin</option>
                </select>
              </div>
            </div>

            {/* Donor CTA */}
            <button
              onClick={onOpenDonorModal}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg text-crimson-700 bg-crimson-50 hover:bg-crimson-100 border border-crimson-200 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Donor</span>
            </button>

            {/* Blood Request CTA */}
            <button
              onClick={onOpenRequestModal}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-lg text-white bg-crimson-600 hover:bg-crimson-700 shadow-sm shadow-crimson-200 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Blood</span>
            </button>

            {/* Auth Action */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate" title={user.email}>
                  {user.full_name}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-crimson-600 rounded-lg hover:bg-slate-100 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                <span>Sign In</span>
              </button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4">
          
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-semibold text-slate-500">Language:</span>
            <div className="flex gap-1 text-xs">
              <button 
                onClick={() => setCurrentLang('en')} 
                className={`px-2.5 py-1 rounded ${currentLang === 'en' ? 'bg-crimson-600 text-white font-bold' : 'bg-slate-100'}`}
              >
                English
              </button>
              <button 
                onClick={() => setCurrentLang('kn')} 
                className={`px-2.5 py-1 rounded ${currentLang === 'kn' ? 'bg-crimson-600 text-white font-bold' : 'bg-slate-100'}`}
              >
                ಕನ್ನಡ
              </button>
              <button 
                onClick={() => setCurrentLang('hi')} 
                className={`px-2.5 py-1 rounded ${currentLang === 'hi' ? 'bg-crimson-600 text-white font-bold' : 'bg-slate-100'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 mb-1">Switch View Role:</div>
            <select
              value={activeRole}
              onChange={(e) => {
                const newRole = e.target.value;
                setActiveRole(newRole);
                if (newRole !== 'visitor') {
                  setActiveView('dashboard');
                }
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-sm font-medium"
            >
              <option value="visitor">Public Visitor</option>
              <option value="donor">Voluntary Donor</option>
              <option value="requester">Patient / Requester</option>
              <option value="hospital">Hospital Staff</option>
              <option value="bloodbank">Verified Blood Bank</option>
              <option value="admin">Platform Administrator</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-slate-100 text-slate-800"
            >
              Home Overview
            </button>
            {activeRole !== 'visitor' && (
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-crimson-50 text-crimson-700 border border-crimson-200"
              >
                Dashboard
              </button>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t">
            <button
              onClick={() => {
                onOpenRequestModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg bg-crimson-600 text-white shadow"
            >
              <FileText className="w-4 h-4" />
              <span>Request Blood Assistance</span>
            </button>
            <button
              onClick={() => {
                onOpenDonorModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg bg-white border border-slate-300 text-slate-800"
            >
              <UserPlus className="w-4 h-4 text-crimson-600" />
              <span>Register as Donor</span>
            </button>
          </div>

        </div>
      )}
    </nav>
  );
};
