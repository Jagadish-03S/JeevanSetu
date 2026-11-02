# JEEVANSETU (जीवनसेतु / ಜೀವನಸೇತು)

**AI-Assisted Blood Donor & Blood Bank Coordination Platform**
*Designed for ethical, privacy-preserving, and verified healthcare coordination in Karnataka, India.*

> **IMPORTANT CLINICAL NOTICE:** JEEVANSETU is an informational coordination and matching platform, **not** an emergency medical dispatch service or medical authority. Blood compatibility, cross-matching, donor biological eligibility, infectious disease testing (HIV, HBV, HCV, Syphilis, Malaria), and transfusion decisions are strictly performed by qualified healthcare professionals and licensed blood bank staff under the Drugs and Cosmetics Rules, 1945 and National Blood Transfusion Council (NBTC) guidelines. In life-threatening emergencies, dial **112** (National Emergency) or **108** (Ambulance).

---

## Architecture & Project Structure

```
JeevanSetu/
├── client/                 # React 18 + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/     # UI, Modals, Maps, and Navigation
│   │   │   └── dashboards/ # Role dashboards (Donor, Requester, Hospital, Admin)
│   │   ├── data/           # Mock Karnataka pilot dataset & compatibility charts
│   │   ├── translations/   # Trilingual engine (English, Kannada, Hindi)
│   │   ├── App.jsx         # Root component & role view state
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Tailwind directives & custom map styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                 # Node.js + Express REST API (Phase 3)
├── database/               # PostgreSQL schema & migration scripts (Phase 3)
├── ai-service/             # Optional Python FastAPI prioritization service (Phase 5)
├── docs/                   # Architectural blueprints & clinical guidelines
└── README.md
```

---

## Implemented in Phase 1

1. **Healthcare Design System**: Clean white canvas, medical red accents (`#DC2626`), dark navy typography (`#0F172A`), soft slate cards, responsive mobile/tablet/desktop layouts.
2. **Emergency 112/108 Ribbon**: Prominent urgent-care banner linking directly to emergency lines.
3. **Multilingual Support**: Instant toggle between **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)**.
4. **Interactive Leaflet + OpenStreetMap Map**: Dynamic pins for accredited Karnataka blood centres (Bengaluru, Mysuru, Hubballi, Mangaluru, etc.) with verified badges, license numbers, and directions.
5. **Component Stock Search**: Search and filter by Karnataka district, blood group, and component (PRBC, Platelets, FFP, Whole Blood).
6. **Voluntary Donor Screening Guide**: Interactive pre-assessment tool adhering to NBTC age, weight, and donation interval criteria.
7. **Privacy-Preserving Donor Modal**: Confidential contact entry with explicit double-opt-in consent checkboxes (no public phone/location disclosure).
8. **Clinical Blood Request Modal**: Requisition logger requiring hospital details, doctor reference ID, component type, and urgency level.
9. **Role-Based Dashboard Previews**:
   - **Voluntary Donor**: Availability toggle, incoming voluntary match queue, consent-gated acceptance, donation impact tracking.
   - **Patient / Requester**: 8-stage visual lifecycle progress tracker (`Submitted` → `Fulfilled`).
   - **Hospital & Blood Bank**: Component stock editor (PRBC, Platelets, FFP) with "Publish Verified Stock" and requisition verification queue.
   - **Platform Administrator**: Metrics, hospital accreditation approval queue, AI abuse pattern screening, and immutable regulatory audit trail.

---

## Running the Frontend Locally

```bash
# Navigate to the client directory
cd client

# Install dependencies (already executed)
npm install

# Start Vite development server
npm run dev
# The application will be available at http://localhost:5173
```

