-- ====================================================================
-- JEEVANSETU - PostgreSQL Production Database Schema
-- Standard: PostgreSQL 14+ / Supabase Compatible
-- All timestamps stored in UTC with timezone (TIMESTAMPTZ)
-- UUID v4 used for entity security and prevention of ID enumeration
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY, -- 'visitor', 'donor', 'requester', 'hospital', 'bloodbank', 'admin'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30), -- Kept confidential in all public queries
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. USER_ROLES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 4. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    emergency_phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hospitals_district ON hospitals(district);

-- 5. BLOOD_BANKS TABLE
CREATE TABLE IF NOT EXISTS blood_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL, -- CDSCO / SBTC issued
    category VARCHAR(100) DEFAULT 'Government' CHECK (category IN ('Government', 'RedCross', 'Trust/Charitable', 'Private Hospital')),
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    emergency_helpline VARCHAR(50) NOT NULL,
    operating_hours VARCHAR(100) DEFAULT '24x7 Emergency Services',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date DATE,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blood_banks_district ON blood_banks(district);
CREATE INDEX IF NOT EXISTS idx_blood_banks_license ON blood_banks(license_number);

-- 6. DONOR_PROFILES TABLE (Strict privacy isolation)
CREATE TABLE IF NOT EXISTS donor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(15) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay (hh)')),
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    age INTEGER CHECK (age >= 18 AND age <= 65),
    weight_kg NUMERIC(5, 2) CHECK (weight_kg >= 45.0),
    district VARCHAR(100) NOT NULL,
    approximate_locality VARCHAR(255) NOT NULL, -- Approximate landmark only, NO exact residential address
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    last_donation_date DATE,
    total_donations INTEGER DEFAULT 0,
    has_chronic_illness BOOLEAN DEFAULT FALSE,
    recent_tattoo_surgery BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donor_profiles_blood_district ON donor_profiles(blood_group, district);

-- 7. DONOR_AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS donor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID UNIQUE NOT NULL REFERENCES donor_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'Temporarily Unavailable', 'Not Available')),
    receive_emergency_alerts BOOLEAN DEFAULT TRUE,
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    notes VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. BLOOD_REQUESTS TABLE (Requisition tracking)
CREATE TABLE IF NOT EXISTS blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'REQ-2026-KA-1001'
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER,
    patient_gender VARCHAR(20),
    requester_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    requester_name VARCHAR(255) NOT NULL,
    requester_phone VARCHAR(30) NOT NULL,
    requester_relation VARCHAR(100) NOT NULL,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    hospital_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    requisition_id VARCHAR(100) NOT NULL, -- Hospital doctor requisition slip number
    blood_group VARCHAR(15) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay (hh)')),
    component VARCHAR(100) NOT NULL DEFAULT 'Packed Red Blood Cells (PRBC)',
    units_requested INTEGER NOT NULL CHECK (units_requested > 0 AND units_requested <= 20),
    urgency_tier VARCHAR(50) NOT NULL CHECK (urgency_tier IN ('Critical Emergency (< 4 hrs)', 'Urgent (< 12 hrs)', 'Standard (Scheduled)')),
    required_datetime TIMESTAMPTZ NOT NULL,
    clinical_notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted' CHECK (status IN (
        'Submitted',
        'Verification Pending',
        'Verified',
        'Matching in Progress',
        'Donor Response Received',
        'Referred to Blood Bank',
        'Fulfilled',
        'Cancelled'
    )),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_district_group ON blood_requests(district, blood_group);

-- 9. REQUEST_DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS request_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
    document_type VARCHAR(100) DEFAULT 'Hospital Requisition Slip',
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    file_size_bytes INTEGER,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. BLOOD_INVENTORY TABLE
CREATE TABLE IF NOT EXISTS blood_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blood_bank_id UUID NOT NULL REFERENCES blood_banks(id) ON DELETE CASCADE,
    blood_group VARCHAR(15) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay (hh)')),
    component VARCHAR(100) NOT NULL CHECK (component IN ('Whole Blood', 'Packed Red Blood Cells (PRBC)', 'Platelet Concentrate (PRP)', 'Single Donor Platelet (SDP)', 'Fresh Frozen Plasma (FFP)', 'Cryoprecipitate')),
    units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
    units_reserved INTEGER NOT NULL DEFAULT 0 CHECK (units_reserved >= 0),
    last_verified_by UUID REFERENCES users(id),
    last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_bank_group_component UNIQUE (blood_bank_id, blood_group, component)
);

CREATE INDEX IF NOT EXISTS idx_inventory_lookup ON blood_inventory(blood_bank_id, blood_group, component);

-- 11. DONOR_MATCHES TABLE
CREATE TABLE IF NOT EXISTS donor_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES donor_profiles(id) ON DELETE CASCADE,
    proximity_km NUMERIC(6, 2),
    compatibility_score INTEGER DEFAULT 100,
    notification_status VARCHAR(50) DEFAULT 'Sent' CHECK (notification_status IN ('Pending', 'Sent', 'Delivered', 'Failed')),
    response_status VARCHAR(50) DEFAULT 'Pending' CHECK (response_status IN ('Pending', 'Accepted', 'Declined', 'Expired')),
    notified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMPTZ,
    consent_given_to_hospital BOOLEAN DEFAULT FALSE,
    CONSTRAINT uq_match_request_donor UNIQUE (request_id, donor_id)
);

-- 12. REQUEST_STATUS_HISTORY TABLE
CREATE TABLE IF NOT EXISTS request_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES users(id),
    actor_role VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'coordination' CHECK (category IN ('urgent_request', 'match_alert', 'verification', 'status_update', 'system')),
    reference_id UUID, -- Links to blood_requests.id or match id
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. DEVICE_TOKENS TABLE (for FCM/Push)
CREATE TABLE IF NOT EXISTS device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fcm_token VARCHAR(500) NOT NULL,
    platform VARCHAR(50) DEFAULT 'web',
    last_active TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_device_token UNIQUE (user_id, fcm_token)
);

-- 15. CONSENT_RECORDS TABLE (Audit compliance with DPDP & healthcare privacy)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL, -- 'VOLUNTARY_DONOR_ALERT', 'ONE_TIME_CONTACT_DISCLOSURE'
    request_id UUID REFERENCES blood_requests(id),
    granted_to_entity VARCHAR(255) NOT NULL, -- e.g. 'Victoria Hospital Blood Bank Coordination Desk'
    consent_text TEXT NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. VERIFICATION_RECORDS TABLE
CREATE TABLE IF NOT EXISTS verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('hospital', 'blood_bank', 'blood_request', 'donor')),
    entity_id UUID NOT NULL,
    verified_by UUID NOT NULL REFERENCES users(id),
    verifier_role VARCHAR(100) NOT NULL,
    verification_status VARCHAR(50) NOT NULL CHECK (verification_status IN ('Approved', 'Rejected', 'Requested_More_Info')),
    checklist_json JSONB,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. ABUSE_REPORTS TABLE
CREATE TABLE IF NOT EXISTS abuse_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID REFERENCES users(id),
    reported_entity_type VARCHAR(50) NOT NULL CHECK (reported_entity_type IN ('blood_request', 'user', 'donor', 'blood_bank')),
    reported_entity_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Investigating', 'Resolved', 'Dismissed')),
    action_taken VARCHAR(100),
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. AUDIT_LOGS TABLE (Immutable ledger)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL, -- e.g. 'DONOR_PHONE_DISCLOSED', 'INVENTORY_MODIFIED', 'REQUEST_VERIFIED'
    actor_id UUID REFERENCES users(id),
    actor_email VARCHAR(255),
    actor_role VARCHAR(50),
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action, created_at);

