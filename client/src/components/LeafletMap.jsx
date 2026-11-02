import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Navigation, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const LeafletMap = ({ 
  bloodBanks = [], 
  selectedBank = null, 
  onSelectBank = () => {},
  centerDistrict = "Bengaluru Urban"
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // District centroid coordinates in Karnataka
  const districtCenters = {
    "Bengaluru Urban": [12.9716, 77.5946],
    "Bengaluru Rural": [13.2385, 77.5458],
    "Mysuru": [12.2958, 76.6394],
    "Hubballi-Dharwad": [15.3647, 75.1240],
    "Mangaluru (Dakshina Kannada)": [12.9141, 74.8560],
    "Belagavi": [15.8497, 74.4977],
    "Kalaburagi": [17.3297, 76.8343],
    "Davanagere": [14.4644, 75.9218],
    "Ballari": [15.1394, 76.9214],
    "Shivamogga": [13.9299, 75.5681]
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates based on current selected district
    const initialCenter = districtCenters[centerDistrict] || [12.9716, 77.5946];

    // Initialize Map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 11,
        scrollWheelZoom: false
      });

      // OpenStreetMap Tiles with clear attribution
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | JEEVANSETU Coordination Network',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      // Pan to new district center
      mapInstanceRef.current.setView(initialCenter, 11);
    }

    return () => {
      // Do not destroy map immediately on minor re-renders, but allow cleanup on unmount
    };
  }, [centerDistrict]);

  // Update Markers when bloodBanks change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    bloodBanks.forEach(bank => {
      // Custom SVG Marker Icon for verified blood bank
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: #dc2626;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.25);
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 14px;
              font-weight: 800;
              margin-top: -2px;
            ">+</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30]
      });

      const marker = L.marker([bank.lat, bank.lng], { icon: customIcon }).addTo(map);

      // Popup Content with verified badge & direct actions
      const popupHtml = `
        <div style="font-family: Inter, sans-serif; min-width: 210px; max-width: 260px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span style="background: #ecfdf5; color: #047857; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
              ✓ VERIFIED BLOOD CENTRE
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">
            ${bank.name}
          </h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0; line-height: 1.3;">
            ${bank.address}
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; margin-bottom: 8px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Operating Hours:</span>
              <strong style="color: #0f172a;">${bank.hours}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">License:</span>
              <span style="font-family: monospace; font-size: 10px; color: #334155;">${bank.licenseNumber}</span>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="tel:${bank.phone}" style="
              flex: 1;
              background: #dc2626;
              color: white;
              text-align: center;
              padding: 5px 8px;
              border-radius: 4px;
              text-decoration: none;
              font-size: 11px;
              font-weight: 600;
              display: inline-block;
            ">
              Call Hotline
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${bank.lat},${bank.lng}" target="_blank" rel="noopener noreferrer" style="
              background: #f1f5f9;
              color: #334155;
              padding: 5px 8px;
              border-radius: 4px;
              text-decoration: none;
              font-size: 11px;
              font-weight: 600;
              border: 1px solid #cbd5e1;
              display: inline-block;
            ">
              Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectBank(bank);
      });

      markersRef.current[bank.id] = marker;
    });

    // Auto-fit bounds if blood banks exist
    if (bloodBanks.length > 0) {
      const group = new L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [bloodBanks]);

  // Focus marker if selectedBank changes from external click
  useEffect(() => {
    if (selectedBank && markersRef.current[selectedBank.id]) {
      const marker = markersRef.current[selectedBank.id];
      const map = mapInstanceRef.current;
      if (map) {
        map.setView([selectedBank.lat, selectedBank.lng], 14, { animate: true });
        marker.openPopup();
      }
    }
  }, [selectedBank]);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Header Overlay Note */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-sm text-xs flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-semibold text-slate-800">
          Showing {bloodBanks.length} Verified Facilities
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-500 hidden sm:inline">Click pin to view contact & route</span>
      </div>

      {/* Emergency Helpline Floating Badge */}
      <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-sm text-[11px] text-slate-700 hidden sm:flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-crimson-600" />
        <span>External navigation links to OpenStreetMap / Directions</span>
      </div>
    </div>
  );
};

