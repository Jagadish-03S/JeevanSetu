# JEEVANSETU REST API Documentation

Base URL: `http://localhost:5000/api` (Local) / `https://api.jeevansetu.in/api` (Production)

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account with hashed password and role assignment.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "Ramesh Kumar",
    "phone": "+91 98450 12091",
    "role": "donor"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com",
      "full_name": "Ramesh Kumar",
      "roles": ["donor"]
    }
  }
  ```

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT token valid for 7 days.
- **Request Body:**
  ```json
  {
    "email": "admin@jeevansetu.in",
    "password": "JeevanSetu@2026"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "11111111-1111-1111-1111-111111111111",
      "email": "admin@jeevansetu.in",
      "full_name": "State SBTC Administrator",
      "roles": ["admin"]
    }
  }
  ```

---

## 2. Donor Coordination Endpoints (`/api/donors`)

### `POST /api/donors/register`
Registers a confidential donor profile.
- **Headers:** `Authorization: Bearer <token>` (Optional for guest onboarding)
- **Request Body:**
  ```json
  {
    "blood_group": "O-",
    "district": "Bengaluru Urban",
    "approximate_locality": "Jayanagar 4th Block",
    "phone": "+91 98450 12091",
    "availability": "Available",
    "consent_privacy": true
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "profile": {
      "id": "donor-uuid",
      "display_name": "Voluntary Donor (#482)",
      "blood_group": "O-",
      "district": "Bengaluru Urban",
      "masked_phone": "+91 98•••• 1209",
      "availability": "Available"
    }
  }
  ```

### `POST /api/donors/respond`
Enables the donor to voluntarily accept or decline an urgent hospital requisition.
- **Request Body:**
  ```json
  {
    "request_id": "REQ-2026-KA-01",
    "decision": "ACCEPT"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Consent granted. Contact details safely routed to the hospital coordination desk.",
    "coordinatorContact": {
      "hospital": "Victoria Hospital, Trauma Emergency Block",
      "requisitionId": "VH-TR-88219",
      "helpline": "1800-425-4422"
    }
  }
  ```

---

## 3. Blood Requisitions Endpoints (`/api/requests`)

### `POST /api/requests`
Submits a clinical blood assistance request.
- **Request Body:**
  ```json
  {
    "patient_name": "Chandrashekar B.",
    "hospital_name": "Victoria Hospital",
    "district": "Bengaluru Urban",
    "requisition_id": "VH-EM-2026/902",
    "blood_group": "O-",
    "component": "Packed Red Blood Cells (PRBC)",
    "units_requested": 2,
    "urgency_tier": "Critical Emergency (< 4 hrs)",
    "required_datetime": "Today 11:00 PM",
    "requester_name": "Dr. Sandeep Rao",
    "requester_phone": "+91 98765 00112",
    "requester_relation": "Attending Surgeon"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Blood request logged successfully. Awaiting clinical desk verification.",
    "request": {
      "id": "req-uuid",
      "tracking_code": "REQ-2026-KA-4102",
      "status": "Verification Pending",
      "priority_score": 95
    }
  }
  ```

### `PUT /api/requests/:id/verify`
Requires `hospital`, `bloodbank`, or `admin` role. Verifies doctor requisition and triggers donor matching.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Request successfully verified and screened against voluntary donor pool.",
    "matchedDonorsCount": 3
  }
  ```

---

## 4. Blood Bank & Inventory Endpoints (`/api/blood-banks`)

### `GET /api/blood-banks`
Search accredited blood centres.
- **Query Parameters:** `district`, `blood_group`, `component`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 3,
    "bloodBanks": [ ... ]
  }
  ```

### `PUT /api/blood-banks/:id/inventory`
Requires `hospital`, `bloodbank`, or `admin` role.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "inventory": {
      "O+": { "PRBC": 18, "Platelets": 8, "FFP": 20, "WholeBlood": 10 }
    }
  }
  ```

