const { Pool } = require('pg');

let pool = null;
let usePostgres = false;

// If DATABASE_URL is configured, attempt connection to PostgreSQL
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    usePostgres = true;
    console.log('[Database] Configured PostgreSQL Pool with DATABASE_URL.');
  } catch (err) {
    console.warn('[Database] PostgreSQL connection failed, falling back to In-Memory store.', err.message);
    usePostgres = false;
  }
}

// In-Memory Fallback Store seeded with Karnataka Pilot benchmark dataset
const inMemoryStore = {
  users: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@jeevansetu.in',
      password_hash: '$2a$10$AZCB6UzbS2LRctkNcKFBbOjjX3HqBxE.o/EIGws2uO3GCeleSUEiC', // 'JeevanSetu@2026'
      full_name: 'State SBTC Administrator',
      phone: '+91 80 2235 1200',
      roles: ['admin'],
      status: 'active'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'victoria.desk@bmcri.edu.in',
      password_hash: '$2a$10$AZCB6UzbS2LRctkNcKFBbOjjX3HqBxE.o/EIGws2uO3GCeleSUEiC',
      full_name: 'Dr. Ananya Murthy (Victoria Blood Centre)',
      phone: '+91 80 2670 1150',
      roles: ['hospital', 'bloodbank'],
      status: 'active'
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'donor.kiran@example.com',
      password_hash: '$2a$10$AZCB6UzbS2LRctkNcKFBbOjjX3HqBxE.o/EIGws2uO3GCeleSUEiC',
      full_name: 'Kiran R.',
      phone: '+91 98450 12091',
      roles: ['donor'],
      status: 'active'
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      email: 'patient.prakash@example.com',
      password_hash: '$2a$10$AZCB6UzbS2LRctkNcKFBbOjjX3HqBxE.o/EIGws2uO3GCeleSUEiC',
      full_name: 'Prakash S.',
      phone: '+91 94480 33219',
      roles: ['requester'],
      status: 'active'
    }
  ],
  donor_profiles: [
    {
      id: 'donor-01',
      user_id: '33333333-3333-3333-3333-333333333333',
      display_name: 'Kiran R. (Donor #401)',
      blood_group: 'O-',
      district: 'Bengaluru Urban',
      approximate_locality: 'Jayanagar 4th Block (~4.2 km from Victoria)',
      latitude: 12.9299,
      longitude: 77.5833,
      availability: 'Available',
      receive_emergency_alerts: true,
      last_donation_date: '2026-07-15',
      total_donations: 6,
      masked_phone: '+91 98•••• 1209',
      has_consented_requests: {}
    },
    {
      id: 'donor-02',
      user_id: 'user-divya-402',
      display_name: 'Divya N. (Donor #402)',
      blood_group: 'B-',
      district: 'Bengaluru Urban',
      approximate_locality: 'Indiranagar 100ft Rd (~3.8 km from Bowring)',
      latitude: 12.9784,
      longitude: 77.6408,
      availability: 'Available',
      receive_emergency_alerts: true,
      last_donation_date: '2026-05-10',
      total_donations: 4,
      masked_phone: '+91 94•••• 7833',
      has_consented_requests: {}
    },
    {
      id: 'donor-03',
      user_id: 'user-sunil-403',
      display_name: 'Sunil Hegde (Donor #403)',
      blood_group: 'O+',
      district: 'Mysuru',
      approximate_locality: 'Kuvempunagar (~3.5 km from K.R. Hospital)',
      latitude: 12.2882,
      longitude: 76.6278,
      availability: 'Available',
      receive_emergency_alerts: true,
      last_donation_date: '2026-06-20',
      total_donations: 3,
      masked_phone: '+91 99•••• 5511',
      has_consented_requests: {}
    }
  ],
  blood_banks: [
    {
      id: 'bb-1',
      name: 'Victoria Hospital Central Blood Bank (BMCRI)',
      type: 'Government Medical College Blood Centre',
      licenseNumber: 'KA-BL-10291/SBTC',
      isVerified: true,
      verificationDate: '2025-10-15',
      district: 'Bengaluru Urban',
      address: 'Fort, K.R. Market, Near City Market, Bengaluru - 560002',
      lat: 12.9628,
      lng: 77.5756,
      phone: '+91 80 2670 1150',
      emergencyHelpline: '1800-425-4422',
      hours: '24x7 Emergency Services',
      lastUpdated: '12 mins ago',
      inventory: {
        'O+': { PRBC: 14, Platelets: 6, FFP: 18, WholeBlood: 8 },
        'O-': { PRBC: 2, Platelets: 1, FFP: 4, WholeBlood: 1 },
        'A+': { PRBC: 11, Platelets: 4, FFP: 12, WholeBlood: 5 },
        'A-': { PRBC: 3, Platelets: 2, FFP: 2, WholeBlood: 0 },
        'B+': { PRBC: 16, Platelets: 5, FFP: 15, WholeBlood: 9 },
        'B-': { PRBC: 2, Platelets: 0, FFP: 3, WholeBlood: 1 },
        'AB+': { PRBC: 8, Platelets: 3, FFP: 6, WholeBlood: 3 },
        'AB-': { PRBC: 1, Platelets: 0, FFP: 2, WholeBlood: 0 },
        'Bombay (hh)': { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
      }
    },
    {
      id: 'bb-2',
      name: 'Indian Red Cross Society Blood Centre',
      type: 'Charitable Blood Bank',
      licenseNumber: 'KA-BL-00109/SBTC',
      isVerified: true,
      verificationDate: '2025-06-12',
      district: 'Bengaluru Urban',
      address: '26, Red Cross Bhavan, Race Course Road, Bengaluru - 560001',
      lat: 12.9830,
      lng: 77.5855,
      phone: '+91 80 2226 8435',
      emergencyHelpline: '080-22264205',
      hours: '8:00 AM - 10:00 PM',
      lastUpdated: '1 hour ago',
      inventory: {
        'O+': { PRBC: 22, Platelets: 8, FFP: 20, WholeBlood: 12 },
        'O-': { PRBC: 4, Platelets: 2, FFP: 5, WholeBlood: 2 },
        'A+': { PRBC: 15, Platelets: 6, FFP: 14, WholeBlood: 7 },
        'A-': { PRBC: 3, Platelets: 1, FFP: 3, WholeBlood: 1 },
        'B+': { PRBC: 18, Platelets: 7, FFP: 16, WholeBlood: 10 },
        'B-': { PRBC: 3, Platelets: 2, FFP: 3, WholeBlood: 1 },
        'AB+': { PRBC: 9, Platelets: 4, FFP: 7, WholeBlood: 4 },
        'AB-': { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 0 },
        'Bombay (hh)': { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
      }
    },
    {
      id: 'bb-3',
      name: 'K.R. Hospital Blood Centre (MMCRI)',
      type: 'Government Teaching Hospital',
      licenseNumber: 'KA-MY-04183/SBTC',
      isVerified: true,
      verificationDate: '2025-09-01',
      district: 'Mysuru',
      address: 'Irwin Road, Mysuru - 570001',
      lat: 12.3155,
      lng: 76.6508,
      phone: '+91 821 242 0260',
      emergencyHelpline: '0821-2420260',
      hours: '24x7 Services',
      lastUpdated: '40 mins ago',
      inventory: {
        'O+': { PRBC: 8, Platelets: 3, FFP: 9, WholeBlood: 5 },
        'O-': { PRBC: 1, Platelets: 0, FFP: 1, WholeBlood: 0 },
        'A+': { PRBC: 6, Platelets: 2, FFP: 5, WholeBlood: 3 },
        'A-': { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 0 },
        'B+': { PRBC: 10, Platelets: 4, FFP: 8, WholeBlood: 4 },
        'B-': { PRBC: 1, Platelets: 0, FFP: 2, WholeBlood: 0 },
        'AB+': { PRBC: 4, Platelets: 1, FFP: 3, WholeBlood: 1 },
        'AB-': { PRBC: 0, Platelets: 0, FFP: 1, WholeBlood: 0 },
        'Bombay (hh)': { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
      }
    }
  ],
  blood_requests: [
    {
      id: 'req-01',
      tracking_code: 'REQ-2026-KA-01',
      patient_name: 'Ramesh K.',
      patient_age: 48,
      patient_gender: 'Male',
      requester_name: 'Dr. Sandeep Rao',
      requester_phone: '+91 94480 33219',
      requester_relation: 'Attending Physician',
      hospital_name: 'Victoria Hospital, Trauma Emergency Block',
      district: 'Bengaluru Urban',
      blood_group: 'O-',
      component: 'Packed Red Blood Cells (PRBC)',
      units_requested: 2,
      urgency_tier: 'Urgent (< 12 hrs)',
      required_datetime: 'Today, 11:30 PM',
      requisition_id: 'VH-TR-88219',
      status: 'Donor Response Received',
      verified_by: 'Dr. Ananya Murthy (Karnataka SBTC Coordinator)',
      verified_at: new Date().toISOString(),
      medical_note: 'Elective emergency vascular revision. Cross-matching in progress at hospital lab.',
      matched_donors: ['donor-01'],
      consented_donors: ['donor-01']
    }
  ],
  audit_logs: [
    {
      id: 'audit-01',
      action: 'SYSTEM_BOOT',
      actor_email: 'system@jeevansetu.in',
      actor_role: 'system',
      resource_type: 'server',
      details: { message: 'JeevanSetu Core Services Initialized' },
      created_at: new Date().toISOString()
    }
  ],
  abuse_reports: []
};

module.exports = {
  pool,
  usePostgres,
  inMemoryStore,
  query: async (text, params) => {
    if (usePostgres && pool) {
      return pool.query(text, params);
    }
    return null;
  }
};
