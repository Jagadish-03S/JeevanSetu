import React, { useState } from 'react';
import { translations } from './translations/translations';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BloodBankSearch } from './components/BloodBankSearch';
import { HowItWorks } from './components/HowItWorks';
import { EligibilityChecker } from './components/EligibilityChecker';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { DonorRegisterModal } from './components/DonorRegisterModal';
import { BloodRequestModal } from './components/BloodRequestModal';
import { DonorDashboard } from './components/dashboards/DonorDashboard';
import { RequesterDashboard } from './components/dashboards/RequesterDashboard';
import { HospitalDashboard } from './components/dashboards/HospitalDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { ArrowLeft, UserCheck, FileText, Building2, ShieldCheck, Globe } from 'lucide-react';

export function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [activeRole, setActiveRole] = useState('visitor');
  const [activeView, setActiveView] = useState('home'); // 'home' | 'dashboard'
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const t = translations[currentLang] || translations.en;

  const roleLabels = {
    visitor: "Public Visitor",
    donor: "Voluntary Donor Roster",
    requester: "Patient / Requester Tracking",
    hospital: "Hospital Medical Staff Portal",
    bloodbank: "Verified Blood Centre Console",
    admin: "Platform Administrator Console"
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-navy-900 selection:bg-crimson-100 selection:text-crimson-700">
      
      {/* 1. Emergency Top Ribbon */}
      <EmergencyBanner 
        currentLang={currentLang} 
        translations={translations} 
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        translations={translations}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDonorModal={() => setIsDonorModalOpen(true)}
        onOpenRequestModal={() => setIsRequestModalOpen(true)}
      />

      {/* 3. Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' ? (
          <div>
            {/* Hero Section */}
            <HeroSection
              currentLang={currentLang}
              translations={translations}
              onSearchClick={() => {
                const el = document.getElementById('search-banks-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onDonorClick={() => setIsDonorModalOpen(true)}
              onRequestClick={() => setIsRequestModalOpen(true)}
            />

            {/* Blood Bank Search & Interactive Map */}
            <BloodBankSearch
              currentLang={currentLang}
              translations={translations}
              onRequestClick={() => setIsRequestModalOpen(true)}
            />

            {/* How It Works Workflow */}
            <HowItWorks
              currentLang={currentLang}
              translations={translations}
            />

            {/* Eligibility Checker */}
            <EligibilityChecker
              currentLang={currentLang}
              translations={translations}
              onRegisterClick={() => setIsDonorModalOpen(true)}
            />

            {/* FAQ Accordion */}
            <FaqSection
              currentLang={currentLang}
              translations={translations}
            />
          </div>
        ) : (
          /* Role Dashboard View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Dashboard Breadcrumbs & Role Switcher Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView('home')}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 text-xs font-semibold shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Public Home</span>
                </button>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Role View
                  </div>
                  <h2 className="text-xl font-extrabold text-navy-900">
                    {roleLabels[activeRole]}
                  </h2>
                </div>
              </div>

              {/* Quick Role Switch Buttons in Dashboard */}
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
                <button
                  onClick={() => setActiveRole('donor')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    activeRole === 'donor' ? 'bg-crimson-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Donor
                </button>
                <button
                  onClick={() => setActiveRole('requester')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    activeRole === 'requester' ? 'bg-crimson-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Patient
                </button>
                <button
                  onClick={() => setActiveRole('hospital')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    activeRole === 'hospital' || activeRole === 'bloodbank' ? 'bg-crimson-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Blood Bank / Hospital
                </button>
                <button
                  onClick={() => setActiveRole('admin')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    activeRole === 'admin' ? 'bg-crimson-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Role-Specific Dashboard Renderer */}
            {activeRole === 'donor' && (
              <DonorDashboard currentLang={currentLang} translations={translations} />
            )}
            {activeRole === 'requester' && (
              <RequesterDashboard 
                currentLang={currentLang} 
                translations={translations}
                onNewRequestClick={() => setIsRequestModalOpen(true)}
              />
            )}
            {(activeRole === 'hospital' || activeRole === 'bloodbank') && (
              <HospitalDashboard currentLang={currentLang} translations={translations} />
            )}
            {activeRole === 'admin' && (
              <AdminDashboard currentLang={currentLang} translations={translations} />
            )}
            {activeRole === 'visitor' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
                <Globe className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-navy-900">You are in Public Visitor Mode</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Select a specific role above (Voluntary Donor, Patient/Requester, Hospital Staff, or Admin) to test the corresponding dedicated portal.
                </p>
              </div>
            )}

          </div>
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        currentLang={currentLang}
        translations={translations}
      />

      {/* 5. Modals */}
      <DonorRegisterModal
        isOpen={isDonorModalOpen}
        onClose={() => setIsDonorModalOpen(false)}
        onRegisterSuccess={() => {
          setActiveRole('donor');
          setActiveView('dashboard');
        }}
      />

      <BloodRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestSuccess={() => {
          setActiveRole('requester');
          setActiveView('dashboard');
        }}
      />

    </div>
  );
}

export default App;
