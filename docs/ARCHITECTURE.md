# JEEVANSETU - System Architecture & Technical Blueprint

## 1. System Overview
JEEVANSETU is a production-oriented healthcare technology platform designed to coordinate voluntary blood donations and accredited blood centre inventories across Karnataka, India. 

```
                                  [ Users & Stakeholders ]
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
       [ Voluntary Donors ]        [ Patients / Requesters ]     [ Hospital & Blood Banks ]
               │                             │                             │
               └─────────────────────────────┼─────────────────────────────┘
                                             ▼
                                  [ React 18 + Vite SPA ]
                             Tailwind CSS, Leaflet Maps, Socket.IO
                                             │
                                     REST APIs / WebSockets
                                             ▼
                            [ Express.js Coordination Hub ]
                      JWT Auth, RBAC, Rate Limiting, Audit Logging
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
    [ PostgreSQL 14+ / Supabase ]                           [ AI Prioritization Engine ]
  18 Tables, UUIDs, Encryption, DPDP                       Heuristic Scoring & Abuse Filter
```

---

## 2. Security & Privacy Architecture (DPDP & NBTC Aligned)

### A. Zero Contact Leakage Policy
- Voluntary donor mobile numbers, residential addresses, and exact live GPS coordinates are **never exposed in public APIs or web pages**.
- Contact details are encrypted at rest and accessible only through a double-opt-in consent workflow.

### B. Consent-Gated Contact Disclosure
1. When a patient request is verified, eligible donors within proximity receive a private notification.
2. The notification includes the hospital name, required units, and urgency level—without revealing patient contact details.
3. If and only if the voluntary donor explicitly clicks **"Accept & Share Contact"**, a cryptographically logged consent record is generated.
4. The hospital blood desk receives a single-use authorized contact channel to coordinate the donation.

---

## 3. Technology Stack Specification

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance responsive UI, medical crimson design system |
| **Maps** | Leaflet, OpenStreetMap | Accredited blood centre mapping without Google Maps billing lock-in |
| **Real-time** | Socket.IO Client / Server | Instant push notifications for requisitions & donor responses |
| **Backend** | Node.js, Express.js | REST API, role-based authorization, matching algorithms |
| **Database** | PostgreSQL 14+, Supabase | Relational data integrity, foreign key constraints, UUID v4 |
| **AI / Heuristics** | Python FastAPI / Node.js Engine | Urgency prioritization & anomaly pattern detection |
| **Deployment** | Vercel (Frontend), Railway (Backend) | Cloud deployment with continuous integration |

---

## 4. Role-Based Access Control (RBAC) Matrix

| Capability | Public Visitor | Voluntary Donor | Patient / Requester | Hospital Staff | Blood Bank Staff | Platform Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Search Accredited Blood Banks | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Reported Inventory | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Register Confidential Donor Profile | - | ✓ | - | - | - | - |
| Submit Blood Requisition | - | - | ✓ | ✓ | - | - |
| Verify Medical Requisitions | - | - | - | ✓ | ✓ | ✓ |
| Update Blood Component Stock | - | - | - | - | ✓ | ✓ |
| Approve Blood Bank Licenses | - | - | - | - | - | ✓ |
| View System Audit Logs | - | - | - | - | - | ✓ |

