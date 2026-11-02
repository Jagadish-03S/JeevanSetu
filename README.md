# JEEVANSETU (जीवनसेतु / ಜೀವನಸೇತು)

**AI-Assisted Blood Donor & Blood Bank Coordination Platform**
*Designed for ethical, privacy-preserving, and verified healthcare coordination in Karnataka, India.*

> **IMPORTANT CLINICAL & LEGAL NOTICE:** JEEVANSETU is an informational coordination and matching platform, **not** an emergency medical dispatch service or medical authority. Blood compatibility, cross-matching, donor biological eligibility, infectious disease testing (HIV, HBV, HCV, Syphilis, Malaria), and transfusion decisions are strictly performed by qualified healthcare professionals and licensed blood bank staff under the Drugs and Cosmetics Rules, 1945 and National Blood Transfusion Council (NBTC) guidelines. In life-threatening emergencies, dial **112** (National Emergency) or **108** (Ambulance).

---

## Complete Project Structure

```
JeevanSetu/
├── client/                     # Frontend: React 18 + Vite + Tailwind CSS + Leaflet
│   ├── src/
│   │   ├── components/         # UI, Modals, Maps, and Navigation
│   │   │   ├── Navbar.jsx              # Responsive Nav, Auth badges & Trilingual selector
│   │   │   ├── EmergencyBanner.jsx     # Clinical disclaimer & 112/108/104 quick dialers
│   │   │   ├── HeroSection.jsx         # "Every Drop Counts" + Action Cards + Telemetry
│   │   │   ├── BloodBankSearch.jsx     # District, Blood Group & Component inventory search
│   │   │   ├── LeafletMap.jsx          # Interactive OpenStreetMap with verified medical pins
│   │   │   ├── HowItWorks.jsx          # 4-stage transparent coordination workflow
│   │   │   ├── EligibilityChecker.jsx  # Interactive NBTC voluntary donor pre-screening
│   │   │   ├── DonorRegisterModal.jsx  # Confidential registration & consent management
│   │   │   ├── BloodRequestModal.jsx   # Clinical requisition form with 112 emergency notice
│   │   │   ├── LoginModal.jsx          # Role-based login with 1-click demo accounts
│   │   │   ├── FaqSection.jsx          # Accordion addressing privacy, testing & clinical scope
│   │   │   ├── Footer.jsx              # Legal disclaimers, helplines & Karnataka pilot coverage
│   │   │   └── dashboards/             # Dedicated role-based portals
│   │   │       ├── DonorDashboard.jsx      # Availability toggle, consent-gated match alerts
│   │   │       ├── RequesterDashboard.jsx  # 8-stage visual requisition progress tracker
│   │   │       ├── HospitalDashboard.jsx   # Live PRBC/Platelet stock manager & verify queue
│   │   │       └── AdminDashboard.jsx      # Facility license audits & AI pattern abuse detector
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # JWT session management & role persistence
│   │   ├── services/
│   │   │   └── api.js                  # REST API client & real-time Socket.IO connection
│   │   ├── data/
│   │   │   └── mockData.js             # High-fidelity Karnataka pilot dataset
│   │   ├── translations/
│   │   │   └── translations.js         # Localization (English, Kannada, Hindi)
│   │   ├── App.jsx                     # Master state controller & view switcher
│   │   ├── main.jsx                    # Application entry point
│   │   └── index.css                   # Custom styles & Tailwind directives
│   ├── vercel.json                     # Vercel SPA routing configuration
│   └── package.json
├── server/                     # Backend: Node.js + Express + Socket.IO REST API
│   ├── src/
│   │   ├── config/db.js                # Dual-mode PostgreSQL Pool + In-Memory Fallback
│   │   ├── controllers/                # Auth, Donor, Request, Blood Bank, and Admin controllers
│   │   ├── middleware/                 # JWT Auth & Role-Based Access Control (RBAC)
│   │   ├── services/                   # Matching Engine & AI Prioritization / Abuse Scanner
│   │   ├── routes/                     # Modular API routes
│   │   ├── tests/                      # Automated test suite (11 domain tests)
│   │   └── server.js                   # Express application & Socket.IO server
│   ├── Dockerfile                      # Production Docker container
│   ├── Procfile                        # Railway / Heroku process declaration
│   ├── railway.json                    # Railway deployment specification
│   └── package.json
├── database/                   # PostgreSQL DDL & Seed scripts
│   ├── schema.sql                      # 18 production tables with UUIDs & indexes
│   └── seed.sql                        # Verified Karnataka hospitals, blood banks, and accounts
├── ai-service/                 # Python FastAPI microservice for prioritization
│   ├── main.py                         # FastAPI endpoints for scoring & duplicate screening
│   └── requirements.txt
├── docs/                       # Technical & Regulatory Documentation
│   ├── ARCHITECTURE.md                 # System architecture & RBAC matrix
│   ├── API_DOCUMENTATION.md            # Comprehensive REST endpoint specifications
│   ├── DATABASE_SCHEMA.md              # 18-table reference & ER diagram
│   └── CLINICAL_COORDINATION_POLICY.md # NBTC, CDSCO & legal compliance protocols
├── .env.example                # Global environment configuration template
└── README.md
```

---

## Quick Start: Running the Complete Platform Locally

### 1. Start the Backend API Server
```powershell
# In terminal 1: Navigate to server and start
cd server
npm start
# The backend will start on http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

### 2. Start the Frontend Application
```powershell
# In terminal 2: Navigate to client and start
cd client
npm run dev
# The frontend will start on http://localhost:5173
```

### 3. Run the Automated Backend Verification Suite
```powershell
cd server
npm test
```
**Verification Results: 11 / 11 Tests Passed**
- User Registration & JWT Authentication
- Role Permissions & 403 Forbidden Unauthorized Access Prevention
- Platform Admin Secure Retrieval of Audit Logs
- Privacy-Preserving Donor Masking (`+91 98•••• 1209`)
- Requisition Creation with Hospital Reference ID
- Requisition Verification & Matching State Transitions
- Clinical Red Cell Compatibility Matrix Screening
- AI Anomaly & Abuse Pattern Detection
- Real-Time Blood Bank Inventory Publishing

---

## Demo Accounts (Instant 1-Click Access)

Use these pre-configured credentials to test all roles:

| Role | Email | Password | Primary Features |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@jeevansetu.in` | `JeevanSetu@2026` | Facility verification queue, audit trail, AI abuse scanner |
| **Hospital / Blood Bank** | `victoria.desk@bmcri.edu.in` | `JeevanSetu@2026` | Live PRBC/Platelet stock manager, requisition verification |
| **Voluntary Donor** | `donor.kiran@example.com` | `JeevanSetu@2026` | Availability toggle, consent-gated match alerts |
| **Patient / Requester** | `patient.prakash@example.com` | `JeevanSetu@2026` | 8-stage lifecycle tracker (`Submitted` → `Fulfilled`) |

*Note: You can also click any of the "Instant Demo Fill" buttons inside the portal's Sign In modal.*

---

## Deployment Guide

### Frontend Deployment (Vercel)
1. Import the repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Set Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://api.jeevansetu.railway.app/api`)
   - `VITE_SOCKET_URL`: Your deployed backend URL (e.g., `https://api.jeevansetu.railway.app`)
5. Deploy. `client/vercel.json` ensures client-side routes rewrite properly.

### Backend Deployment (Railway)
1. Create a new project on [Railway](https://railway.app).
2. Connect your Git repository and set the root directory to `server`.
3. Railway automatically detects `server/railway.json` and `server/Dockerfile`.
4. Add a PostgreSQL database service in Railway.
5. In the backend service variables, configure:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET`: A secure random 64-character secret
   - `NODE_ENV`: `production`
6. Run `psql -f database/schema.sql` and `database/seed.sql` on the provisioned PostgreSQL database.

---

## Regulatory Compliance & Guidelines

- **National Blood Transfusion Council (NBTC)**: Enforces strictly voluntary donation.
- **Drugs and Cosmetics Rules, 1945**: Clinical screening & blood testing.
- **Digital Personal Data Protection (DPDP) Act, 2023**: Zero public contact exposure; consent-gated disclosure.
- **Emergency Dispatch**: Not an ambulance or trauma service. Dial **112** or **108** for emergencies.
