import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  Filter, 
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { 
  KARNATAKA_DISTRICTS, 
  BLOOD_GROUPS, 
  BLOOD_COMPONENTS, 
  MOCK_BLOOD_BANKS, 
  COMPATIBILITY_CHART 
} from '../data/mockData';
import { LeafletMap } from './LeafletMap';

export const BloodBankSearch = ({ currentLang, translations, onRequestClick }) => {
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru Urban");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);

  const t = translations[currentLang] || translations.en;

  // Filtered blood banks
  const filteredBanks = useMemo(() => {
    return MOCK_BLOOD_BANKS.filter(bank => {
      // District filter
      if (selectedDistrict && bank.district !== selectedDistrict) {
        return false;
      }
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = bank.name.toLowerCase().includes(query);
        const matchesAddress = bank.address.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress) return false;
      }
      // Blood group filter
      if (selectedGroup) {
        const groupInventory = bank.inventory[selectedGroup];
        if (!groupInventory) return false;
        if (selectedComponent) {
          const compKey = selectedComponent.includes("PRBC") ? "PRBC" 
                        : selectedComponent.includes("Platelet") ? "Platelets"
                        : selectedComponent.includes("Plasma") ? "FFP"
                        : "WholeBlood";
          if (!groupInventory[compKey] || groupInventory[compKey] === 0) return false;
        }
      }
      return true;
    });
  }, [selectedDistrict, selectedGroup, selectedComponent, searchTerm]);

  return (
    <section id="search-banks-section" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-crimson-100 text-crimson-800 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>State Blood Transfusion Registry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {t.searchTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {t.searchSubtitle}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* District Selector */}
            <div>
              <label htmlFor="district-select" className="block text-xs font-semibold text-slate-700 mb-1">
                District / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  id="district-select"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedBank(null);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                >
                  {KARNATAKA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Blood Group Filter */}
            <div>
              <label htmlFor="group-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group (Optional)
              </label>
              <select
                id="group-select"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-crimson-500 focus:outline-none"
              >
                <option value="">{t.allBloodGroups}</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Blood Component Filter */}
            <div>
              <label htmlFor="comp-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Component (Optional)
              </label>
              <select
                id="comp-select"
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-crimson-500 focus:outline-none"
              >
                <option value="">{t.allComponents}</option>
                {BLOOD_COMPONENTS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Keyword Search */}
            <div>
              <label htmlFor="keyword-search" className="block text-xs font-semibold text-slate-700 mb-1">
                Search Facility Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="keyword-search"
                  type="text"
                  placeholder="e.g. Victoria, Red Cross..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-crimson-500 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Quick Compatibility Guidance Note if Blood Group selected */}
          {selectedGroup && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-navy-900">
                Screening Guide for {selectedGroup}:
              </span>
              <span>Accepts Red Cells from:</span>
              <div className="flex gap-1">
                {COMPATIBILITY_CHART[selectedGroup]?.map(comp => (
                  <span key={comp} className="bg-red-50 text-crimson-700 font-bold px-2 py-0.5 rounded border border-red-200 text-[11px]">
                    {comp}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-slate-400">
                (Final compatibility requires blood bank cross-matching test)
              </span>
            </div>
          )}
        </div>

        {/* Map & List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <LeafletMap 
              bloodBanks={filteredBanks}
              selectedBank={selectedBank}
              onSelectBank={(bank) => setSelectedBank(bank)}
              centerDistrict={selectedDistrict}
            />
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Inventory Advisory:</strong> Numbers shown are reported by authorized blood bank staff. Transfusion readiness requires direct clinical confirmation and requisition validation.
              </span>
            </div>
          </div>

          {/* Right Column: Blood Bank Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Found <strong>{filteredBanks.length}</strong> verified centres in {selectedDistrict}</span>
              <span>Showing accredited facilities only</span>
            </div>

            {filteredBanks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-navy-900">No matching facilities in this filter</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing the specific blood component filter or switch districts. You can also request emergency coordination assistance.
                </p>
                <button
                  onClick={() => {
                    setSelectedGroup("");
                    setSelectedComponent("");
                    setSearchTerm("");
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredBanks.map(bank => {
                const isSelected = selectedBank?.id === bank.id;
                return (
                  <div
                    key={bank.id}
                    className={`bg-white rounded-2xl p-5 border transition-all ${
                      isSelected 
                        ? 'border-crimson-500 ring-2 ring-crimson-100 shadow-md' 
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Blood Centre
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Lic: {bank.licenseNumber}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-navy-900">
                          {bank.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{bank.address}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {t.lastUpdated}: {bank.lastUpdated}
                        </span>
                      </div>
                    </div>

                    {/* Stock Overview Pills */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Recent Reported Availability (Units):
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
                        {BLOOD_GROUPS.filter(bg => bg !== "Bombay (hh)").map(group => {
                          const stock = bank.inventory[group];
                          const prbc = stock?.PRBC || 0;
                          const hasStock = prbc > 0;
                          return (
                            <div 
                              key={group}
                              className={`p-1.5 rounded-lg border text-xs ${
                                selectedGroup === group
                                  ? 'bg-crimson-600 text-white border-crimson-600 font-bold'
                                  : hasStock
                                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                                    : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400'
                              }`}
                            >
                              <div className="font-bold text-[11px]">{group}</div>
                              <div className="text-[10px] mt-0.5">
                                {prbc} <span className="opacity-75">PRBC</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${bank.phone}`}
                          className="inline-flex items-center gap-1.5 bg-crimson-600 hover:bg-crimson-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-2xs transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{t.contactFacility} ({bank.phone})</span>
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${bank.lat},${bank.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-2 rounded-lg border border-slate-200 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t.directions}</span>
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedBank(bank);
                          const el = document.getElementById('search-banks-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs font-semibold text-crimson-600 hover:text-crimson-700 inline-flex items-center gap-1"
                      >
                        <span>Focus on Map</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

