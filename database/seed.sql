-- ====================================================================
-- JEEVANSETU - PostgreSQL Initial Seed Data (Karnataka Pilot)
-- Clearly labelled as DEMO SEED DATA
-- Default password for all demo accounts: "JeevanSetu@2026"
-- ====================================================================

-- Insert Roles
INSERT INTO roles (id, name, description) VALUES
('visitor', 'Public Visitor', 'Unauthenticated public visitor with read-only directory access'),
('donor', 'Voluntary Donor', 'Consented voluntary donor with private profile and notification rights'),
('requester', 'Patient / Requester', 'Verified patient or authorized relative logging requisitions'),
('hospital', 'Hospital Staff', 'Authorized medical officer or nursing desk validating requisitions'),
('bloodbank', 'Verified Blood Bank Staff', 'Accredited blood centre technician managing component stock'),
('admin', 'Platform Administrator', 'State platform administrator managing verifications and safety')
ON CONFLICT (id) DO NOTHING;

-- Demo Password Hash for 'JeevanSetu@2026' (bcrypt hash)
-- $2b$10$Ew.V6W.P1C8YvV066L3.kOxJ7Zc81a5VshV4P2YhYI53L18G2xMmi

-- Insert Demo Users
INSERT INTO users (id, email, password_hash, full_name, phone, is_phone_verified, is_email_verified, status) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@jeevansetu.in', '$2b$10$Ew.V6W.P1C8YvV066L3.kOxJ7Zc81a5VshV4P2YhYI53L18G2xMmi', 'State SBTC Administrator', '+91 80 2235 1200', TRUE, TRUE, 'active'),
('22222222-2222-2222-2222-222222222222', 'victoria.desk@bmcri.edu.in', '$2b$10$Ew.V6W.P1C8YvV066L3.kOxJ7Zc81a5VshV4P2YhYI53L18G2xMmi', 'Dr. Ananya Murthy (Victoria Blood Centre)', '+91 80 2670 1150', TRUE, TRUE, 'active'),
('33333333-3333-3333-3333-333333333333', 'donor.kiran@example.com', '$2b$10$Ew.V6W.P1C8YvV066L3.kOxJ7Zc81a5VshV4P2YhYI53L18G2xMmi', 'Kiran R.', '+91 98450 12091', TRUE, TRUE, 'active'),
('44444444-4444-4444-4444-444444444444', 'patient.prakash@example.com', '$2b$10$Ew.V6W.P1C8YvV066L3.kOxJ7Zc81a5VshV4P2YhYI53L18G2xMmi', 'Prakash S.', '+91 94480 33219', TRUE, TRUE, 'active')
ON CONFLICT (id) DO NOTHING;

-- Map User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 'admin'),
('22222222-2222-2222-2222-222222222222', 'hospital'),
('22222222-2222-2222-2222-222222222222', 'bloodbank'),
('33333333-3333-3333-3333-333333333333', 'donor'),
('44444444-4444-4444-4444-444444444444', 'requester')
ON CONFLICT DO NOTHING;

-- Insert Accredited Hospitals
INSERT INTO hospitals (id, name, registration_number, district, address, pincode, latitude, longitude, contact_phone, emergency_phone, email, is_verified) VALUES
('55555555-5555-5555-5555-555555555551', 'Victoria Hospital (BMCRI)', 'KA-MED-0012', 'Bengaluru Urban', 'Fort, K.R. Market, Bengaluru', '560002', 12.9628, 77.5756, '+91 80 2670 1150', '1800-425-4422', 'medical.superintendent@bmcri.edu.in', TRUE),
('55555555-5555-5555-5555-555555555552', 'Bowring and Lady Curzon Hospital', 'KA-MED-0044', 'Bengaluru Urban', 'Lady Curzon Road, Shivajinagar, Bengaluru', '560001', 12.9832, 77.6033, '+91 80 2559 1325', '080-25591325', 'bowring.hospital@karnataka.gov.in', TRUE),
('55555555-5555-5555-5555-555555555553', 'K.R. Hospital (MMCRI)', 'KA-MED-0189', 'Mysuru', 'Irwin Road, Mysuru', '570001', 12.3155, 76.6508, '+91 821 242 0260', '0821-2420260', 'krhospital@mmcri.edu.in', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert Accredited Blood Banks
INSERT INTO blood_banks (id, hospital_id, name, license_number, category, district, address, pincode, latitude, longitude, phone, emergency_helpline, operating_hours, is_verified, verification_date) VALUES
('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551', 'Victoria Hospital Central Blood Centre', 'KA-BL-10291/SBTC', 'Government', 'Bengaluru Urban', 'Fort, K.R. Market, Bengaluru', '560002', 12.9628, 77.5756, '+91 80 2670 1150', '1800-425-4422', '24x7 Emergency Services', TRUE, '2025-10-15'),
('66666666-6666-6666-6666-666666666662', NULL, 'Indian Red Cross Society Blood Centre', 'KA-BL-00109/SBTC', 'RedCross', 'Bengaluru Urban', '26, Red Cross Bhavan, Race Course Road, Bengaluru', '560001', 12.9830, 77.5855, '+91 80 2226 8435', '080-22264205', '8:00 AM - 10:00 PM', TRUE, '2025-06-12')
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Inventory
INSERT INTO blood_inventory (blood_bank_id, blood_group, component, units_available, units_reserved) VALUES
('66666666-6666-6666-6666-666666666661', 'O+', 'Packed Red Blood Cells (PRBC)', 14, 2),
('66666666-6666-6666-6666-666666666661', 'O+', 'Platelet Concentrate (PRP)', 6, 1),
('66666666-6666-6666-6666-666666666661', 'O-', 'Packed Red Blood Cells (PRBC)', 2, 0),
('66666666-6666-6666-6666-666666666661', 'A+', 'Packed Red Blood Cells (PRBC)', 11, 1),
('66666666-6666-6666-6666-666666666661', 'B+', 'Packed Red Blood Cells (PRBC)', 16, 3),
('66666666-6666-6666-6666-666666666661', 'AB+', 'Packed Red Blood Cells (PRBC)', 8, 0)
ON CONFLICT (blood_bank_id, blood_group, component) DO NOTHING;

-- Insert Demo Donor Profile
INSERT INTO donor_profiles (id, user_id, display_name, blood_group, gender, age, weight_kg, district, approximate_locality, latitude, longitude, last_donation_date, total_donations) VALUES
('77777777-7777-7777-7777-777777777771', '33333333-3333-3333-3333-333333333333', 'Kiran R. (Donor #401)', 'O-', 'Male', 29, 68.5, 'Bengaluru Urban', 'Jayanagar 4th Block (~4.2 km from Victoria)', 12.9299, 77.5833, '2026-07-15', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO donor_availability (donor_id, status, receive_emergency_alerts) VALUES
('77777777-7777-7777-7777-777777777771', 'Available', TRUE)
ON CONFLICT (donor_id) DO NOTHING;

