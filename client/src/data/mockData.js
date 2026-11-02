// Mock data specifically calibrated for Karnataka Pilot (Bengaluru, Mysuru, Hubballi, Mangaluru, Belagavi)
// All data is explicitly labelled as DEMO DATA.

export const KARNATAKA_DISTRICTS = [
  "Bengaluru Urban",
  "Bengaluru Rural",
  "Mysuru",
  "Hubballi-Dharwad",
  "Mangaluru (Dakshina Kannada)",
  "Belagavi",
  "Kalaburagi",
  "Davanagere",
  "Ballari",
  "Shivamogga"
];

export const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Bombay (hh)"
];

export const BLOOD_COMPONENTS = [
  "Whole Blood",
  "Packed Red Blood Cells (PRBC)",
  "Platelet Concentrate (PRP)",
  "Single Donor Platelet (SDP)",
  "Fresh Frozen Plasma (FFP)",
  "Cryoprecipitate"
];

// Verified Blood Compatibility screening matrix (Approved standard for guidance only)
export const COMPATIBILITY_CHART = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Universal recipient
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"], // Universal donor
  "Bombay (hh)": ["Bombay (hh)"]
};

export const MOCK_BLOOD_BANKS = [
  {
    id: "bb-1",
    name: "Victoria Hospital Central Blood Bank (BMCRI)",
    type: "Government Medical College Blood Centre",
    licenseNumber: "KA-BL-10291/SBTC",
    isVerified: true,
    verificationDate: "2025-10-15",
    district: "Bengaluru Urban",
    address: "Fort, K.R. Market, Near City Market, Bengaluru - 560002",
    lat: 12.9628,
    lng: 77.5756,
    phone: "+91 80 2670 1150",
    emergencyHelpline: "1800-425-4422",
    hours: "24x7 Emergency Services",
    lastUpdated: "12 mins ago",
    inventory: {
      "O+": { PRBC: 14, Platelets: 6, FFP: 18, WholeBlood: 8 },
      "O-": { PRBC: 2, Platelets: 1, FFP: 4, WholeBlood: 1 },
      "A+": { PRBC: 11, Platelets: 4, FFP: 12, WholeBlood: 5 },
      "A-": { PRBC: 3, Platelets: 2, FFP: 2, WholeBlood: 0 },
      "B+": { PRBC: 16, Platelets: 5, FFP: 15, WholeBlood: 9 },
      "B-": { PRBC: 2, Platelets: 0, FFP: 3, WholeBlood: 1 },
      "AB+": { PRBC: 8, Platelets: 3, FFP: 6, WholeBlood: 3 },
      "AB-": { PRBC: 1, Platelets: 0, FFP: 2, WholeBlood: 0 },
      "Bombay (hh)": { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
    }
  },
  {
    id: "bb-2",
    name: "NIMHANS Blood Centre",
    type: "Autonomous Government Institute",
    licenseNumber: "KA-BL-08412/SBTC",
    isVerified: true,
    verificationDate: "2025-08-20",
    district: "Bengaluru Urban",
    address: "Hosur Road, Lakkasandra, Bengaluru - 560029",
    lat: 12.9392,
    lng: 77.5959,
    phone: "+91 80 2699 5240",
    emergencyHelpline: "080-26995000",
    hours: "24x7 Transfusion Services",
    lastUpdated: "35 mins ago",
    inventory: {
      "O+": { PRBC: 9, Platelets: 4, FFP: 10, WholeBlood: 4 },
      "O-": { PRBC: 1, Platelets: 0, FFP: 2, WholeBlood: 0 },
      "A+": { PRBC: 7, Platelets: 3, FFP: 8, WholeBlood: 3 },
      "A-": { PRBC: 1, Platelets: 1, FFP: 1, WholeBlood: 0 },
      "B+": { PRBC: 12, Platelets: 5, FFP: 11, WholeBlood: 6 },
      "B-": { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 1 },
      "AB+": { PRBC: 5, Platelets: 2, FFP: 4, WholeBlood: 2 },
      "AB-": { PRBC: 0, Platelets: 0, FFP: 1, WholeBlood: 0 },
      "Bombay (hh)": { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
    }
  },
  {
    id: "bb-3",
    name: "Indian Red Cross Society Blood Centre",
    type: "Charitable Blood Bank",
    licenseNumber: "KA-BL-00109/SBTC",
    isVerified: true,
    verificationDate: "2025-06-12",
    district: "Bengaluru Urban",
    address: "26, Red Cross Bhavan, Race Course Road, Bengaluru - 560001",
    lat: 12.9830,
    lng: 77.5855,
    phone: "+91 80 2226 8435",
    emergencyHelpline: "080-22264205",
    hours: "8:00 AM - 10:00 PM (Emergency on call)",
    lastUpdated: "1 hour ago",
    inventory: {
      "O+": { PRBC: 22, Platelets: 8, FFP: 20, WholeBlood: 12 },
      "O-": { PRBC: 4, Platelets: 2, FFP: 5, WholeBlood: 2 },
      "A+": { PRBC: 15, Platelets: 6, FFP: 14, WholeBlood: 7 },
      "A-": { PRBC: 3, Platelets: 1, FFP: 3, WholeBlood: 1 },
      "B+": { PRBC: 18, Platelets: 7, FFP: 16, WholeBlood: 10 },
      "B-": { PRBC: 3, Platelets: 2, FFP: 3, WholeBlood: 1 },
      "AB+": { PRBC: 9, Platelets: 4, FFP: 7, WholeBlood: 4 },
      "AB-": { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 0 },
      "Bombay (hh)": { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
    }
  },
  {
    id: "bb-4",
    name: "K.R. Hospital Blood Centre (MMCRI)",
    type: "Government Teaching Hospital",
    licenseNumber: "KA-MY-04183/SBTC",
    isVerified: true,
    verificationDate: "2025-09-01",
    district: "Mysuru",
    address: "Irwin Road, Mysuru - 570001",
    lat: 12.3155,
    lng: 76.6508,
    phone: "+91 821 242 0260",
    emergencyHelpline: "0821-2420260",
    hours: "24x7 Services",
    lastUpdated: "40 mins ago",
    inventory: {
      "O+": { PRBC: 8, Platelets: 3, FFP: 9, WholeBlood: 5 },
      "O-": { PRBC: 1, Platelets: 0, FFP: 1, WholeBlood: 0 },
      "A+": { PRBC: 6, Platelets: 2, FFP: 5, WholeBlood: 3 },
      "A-": { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 0 },
      "B+": { PRBC: 10, Platelets: 4, FFP: 8, WholeBlood: 4 },
      "B-": { PRBC: 1, Platelets: 0, FFP: 2, WholeBlood: 0 },
      "AB+": { PRBC: 4, Platelets: 1, FFP: 3, WholeBlood: 1 },
      "AB-": { PRBC: 0, Platelets: 0, FFP: 1, WholeBlood: 0 },
      "Bombay (hh)": { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
    }
  },
  {
    id: "bb-5",
    name: "KIMS Blood Centre Hubballi",
    type: "Government Medical College Hospital",
    licenseNumber: "KA-HD-02914/SBTC",
    isVerified: true,
    verificationDate: "2025-07-19",
    district: "Hubballi-Dharwad",
    address: "Vidyanagar, PB Road, Hubballi - 580022",
    lat: 15.3647,
    lng: 75.1240,
    phone: "+91 836 237 0057",
    emergencyHelpline: "0836-2370057",
    hours: "24x7 Services",
    lastUpdated: "25 mins ago",
    inventory: {
      "O+": { PRBC: 11, Platelets: 4, FFP: 12, WholeBlood: 6 },
      "O-": { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 1 },
      "A+": { PRBC: 9, Platelets: 3, FFP: 7, WholeBlood: 4 },
      "A-": { PRBC: 1, Platelets: 0, FFP: 1, WholeBlood: 0 },
      "B+": { PRBC: 13, Platelets: 4, FFP: 10, WholeBlood: 7 },
      "B-": { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 1 },
      "AB+": { PRBC: 6, Platelets: 2, FFP: 5, WholeBlood: 2 },
      "AB-": { PRBC: 1, Platelets: 0, FFP: 1, WholeBlood: 0 },
      "Bombay (hh)": { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
    }
  },
  {
    id: "bb-6",
    name: "Wenlock District Hospital Blood Centre",
    type: "Government District Hospital",
    licenseNumber: "KA-DK-01982/SBTC",
    isVerified: true,
    verificationDate: "2025-11-04",
    district: "Mangaluru (Dakshina Kannada)",
    address: "Hampankatta, Mangaluru - 575001",
    lat: 12.8688,
    lng: 74.8427,
    phone: "+91 824 242 4264",
    emergencyHelpline: "0824-2424264",
    hours: "24x7 Services",
    lastUpdated: "50 mins ago",
    inventory: {
      "O+": { PRBC: 10, Platelets: 3, FFP: 8, WholeBlood: 4 },
      "O-": { PRBC: 1, Platelets: 0, FFP: 1, WholeBlood: 0 },
      "A+": { PRBC: 8, Platelets: 2, FFP: 6, WholeBlood: 3 },
      "A-": { PRBC: 2, Platelets: 1, FFP: 2, WholeBlood: 0 },
      "B+": { PRBC: 9, Platelets: 3, FFP: 7, WholeBlood: 5 },
      "B-": { PRBC: 1, Platelets: 0, FFP: 1, WholeBlood: 0 },
      "AB+": { PRBC: 5, Platelets: 1, FFP: 3, WholeBlood: 1 },
      "AB-": { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 },
      "Bombay (hh)": { PRBC: 0, Platelets: 0, FFP: 0, WholeBlood: 0 }
    }
  }
];

export const MOCK_REQUESTS = [
  {
    id: "REQ-2026-KA-01",
    patientName: "Ramesh K.",
    age: 48,
    gender: "Male",
    requesterName: "Dr. Sandeep Rao (Duty Medical Officer)",
    requesterRelation: "Hospital Attending Physician",
    hospitalName: "Victoria Hospital, Trauma Emergency Block",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    urgency: "Urgent (< 12 hrs)",
    requiredDateTime: "Today, 11:30 PM",
    requisitionId: "VH-TR-88219",
    status: "Donor Response Received",
    statusTimeline: [
      { step: "Submitted", timestamp: "06:15 PM", done: true },
      { step: "Verification Pending", timestamp: "06:20 PM", done: true },
      { step: "Verified", timestamp: "06:35 PM", done: true },
      { step: "Matching in Progress", timestamp: "06:40 PM", done: true },
      { step: "Donor Response Received", timestamp: "07:10 PM", done: true },
      { step: "Referred to Blood Bank", timestamp: "Pending", done: false },
      { step: "Fulfilled", timestamp: "Pending", done: false }
    ],
    verifiedBy: "Dr. Ananya Murthy (Karnataka SBTC Coordinator)",
    matchedDonorsCount: 3,
    acceptedDonorsCount: 2,
    medicalNote: "Elective emergency vascular revision. Compatible cross-matching required at hospital lab."
  },
  {
    id: "REQ-2026-KA-02",
    patientName: "Meenakshi S.",
    age: 26,
    gender: "Female",
    requesterName: "Prakash S. (Spouse)",
    requesterRelation: "Spouse",
    hospitalName: "Bowring and Lady Curzon Hospital, Maternity Wing",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    bloodGroup: "B-",
    component: "Platelet Concentrate (PRP)",
    unitsRequired: 4,
    urgency: "Critical Emergency (< 4 hrs)",
    requiredDateTime: "Today, 10:00 PM",
    requisitionId: "BLC-MAT-44120",
    status: "Matching in Progress",
    statusTimeline: [
      { step: "Submitted", timestamp: "07:05 PM", done: true },
      { step: "Verification Pending", timestamp: "07:12 PM", done: true },
      { step: "Verified", timestamp: "07:25 PM", done: true },
      { step: "Matching in Progress", timestamp: "07:30 PM", done: true },
      { step: "Donor Response Received", timestamp: "Pending", done: false },
      { step: "Referred to Blood Bank", timestamp: "Pending", done: false },
      { step: "Fulfilled", timestamp: "Pending", done: false }
    ],
    verifiedBy: "Nurse Supervisor Rekha Patil",
    matchedDonorsCount: 5,
    acceptedDonorsCount: 0,
    medicalNote: "Post-partum thrombocytopenia. Urgent replacement ordered by obstetrician."
  },
  {
    id: "REQ-2026-KA-03",
    patientName: "Vinay Gowda",
    age: 34,
    gender: "Male",
    requesterName: "Dr. Chetan M.",
    requesterRelation: "Orthopedic Surgeon",
    hospitalName: "K.R. Hospital, Mysuru",
    city: "Mysuru",
    district: "Mysuru",
    bloodGroup: "AB+",
    component: "Whole Blood",
    unitsRequired: 1,
    urgency: "Standard (Scheduled)",
    requiredDateTime: "Tomorrow, 09:00 AM",
    requisitionId: "KRH-ORTH-9102",
    status: "Fulfilled",
    statusTimeline: [
      { step: "Submitted", timestamp: "Yesterday 02:00 PM", done: true },
      { step: "Verification Pending", timestamp: "Yesterday 02:15 PM", done: true },
      { step: "Verified", timestamp: "Yesterday 02:30 PM", done: true },
      { step: "Matching in Progress", timestamp: "Yesterday 02:45 PM", done: true },
      { step: "Donor Response Received", timestamp: "Yesterday 03:15 PM", done: true },
      { step: "Referred to Blood Bank", timestamp: "Yesterday 04:00 PM", done: true },
      { step: "Fulfilled", timestamp: "Today 10:00 AM", done: true }
    ],
    verifiedBy: "Blood Bank Officer Dr. K. N. Swamy",
    matchedDonorsCount: 2,
    acceptedDonorsCount: 1,
    medicalNote: "Provided directly from K.R. Hospital stock following voluntary donor replenishment."
  }
];

export const MOCK_DONORS = [
  {
    id: "donor-01",
    displayName: "Kiran R. (Donor #401)",
    bloodGroup: "O-",
    district: "Bengaluru Urban",
    approximateArea: "Jayanagar 4th Block (~4.2 km from Victoria Hospital)",
    availability: "Available",
    receiveRequests: true,
    lastDonationDate: "2026-07-15",
    totalDonations: 6,
    consentActive: true,
    maskedPhone: "+91 98•••• 1209",
    screeningStatus: "Self-Screened Eligible (Subject to Lab Check)"
  },
  {
    id: "donor-02",
    displayName: "Divya N. (Donor #402)",
    bloodGroup: "B-",
    district: "Bengaluru Urban",
    approximateArea: "Indiranagar 100ft Rd (~3.8 km from Bowring)",
    availability: "Available",
    receiveRequests: true,
    lastDonationDate: "2026-05-10",
    totalDonations: 4,
    consentActive: true,
    maskedPhone: "+91 94•••• 7833",
    screeningStatus: "Self-Screened Eligible"
  },
  {
    id: "donor-03",
    displayName: "Anand M. (Donor #403)",
    bloodGroup: "A+",
    district: "Bengaluru Urban",
    approximateArea: "Malleshwaram 8th Cross (~5.1 km from KC General)",
    availability: "Temporarily Unavailable",
    receiveRequests: false,
    lastDonationDate: "2026-10-02",
    totalDonations: 8,
    consentActive: true,
    maskedPhone: "+91 80•••• 9942",
    screeningStatus: "Cooling-Off Period (Donated 1 month ago)"
  },
  {
    id: "donor-04",
    displayName: "Sunil Hegde (Donor #404)",
    bloodGroup: "O+",
    district: "Mysuru",
    approximateArea: "Kuvempunagar (~3.5 km from K.R. Hospital)",
    availability: "Available",
    receiveRequests: true,
    lastDonationDate: "2026-06-20",
    totalDonations: 3,
    consentActive: true,
    maskedPhone: "+91 99•••• 5511",
    screeningStatus: "Self-Screened Eligible"
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: "audit-01",
    action: "HOSPITAL_STOCK_UPDATED",
    actor: "Staff: Victoria Blood Centre (BMCRI)",
    target: "O+ PRBC stock modified (+4 units)",
    timestamp: "12 mins ago",
    status: "Verified by digital entry log"
  },
  {
    id: "audit-02",
    action: "REQUEST_VERIFIED",
    actor: "Dr. Ananya Murthy (SBTC Coordinator)",
    target: "Requisition #VH-TR-88219 verified with Victoria Emergency Desk",
    timestamp: "38 mins ago",
    status: "Verified Requisition"
  },
  {
    id: "audit-03",
    action: "DONOR_CONSENT_GRANTED",
    actor: "Kiran R. (Donor #401)",
    target: "Accepted contact disclosure for REQ-2026-KA-01",
    timestamp: "45 mins ago",
    status: "Consent Logged"
  },
  {
    id: "audit-04",
    action: "BLOOD_BANK_ONBOARDED",
    actor: "Platform Administrator",
    target: "Wenlock District Hospital Blood Centre verified (License: KA-DK-01982/SBTC)",
    timestamp: "Yesterday",
    status: "Active & Verified"
  }
];

export const FAQ_DATA = [
  {
    q: "Is JEEVANSETU an emergency ambulance or transfusion provider?",
    a: "No. JeevanSetu is strictly a coordination and logistics technology platform. It assists in locating verified blood banks, checking recent inventory reports, and alerting voluntary donors. In any medical emergency, always call 112 or visit your nearest hospital casualty department immediately. All blood matching, infectious disease screening, and transfusion authorizations are performed exclusively by licensed blood bank pathologists."
  },
  {
    q: "Are donor phone numbers and home addresses visible to the public?",
    a: "Never. JeevanSetu enforces strict privacy protection. Donors' phone numbers, email addresses, and exact residential addresses are fully encrypted and concealed. When a verified hospital request matches a donor's blood group and district, the donor receives a private voluntary notification. Only if the donor explicitly presses 'Accept & Share Contact' is a one-time connection granted to the verified hospital coordination desk."
  },
  {
    q: "How are blood banks verified on JeevanSetu?",
    a: "Every blood bank must possess a valid license issued by the Central Drugs Standard Control Organisation (CDSCO) and the State Blood Transfusion Council (SBTC). Platform administrators verify official credentials, facility location, and authorized medical officer contacts before enabling inventory publishing."
  },
  {
    q: "Who is eligible to donate blood in Karnataka?",
    a: "Voluntary donors must be between 18 and 65 years old, weigh at least 45 kg, have a hemoglobin level above 12.5 g/dL, and have no active infections, recent major surgeries, or high-risk medical conditions. Men can donate whole blood every 90 days; women can donate every 120 days. Final physical and laboratory screening is always conducted at the blood bank."
  },
  {
    q: "What is the difference between Whole Blood, PRBC, and Platelets?",
    a: "Whole blood is drawn directly from the donor and contains red cells, plasma, and platelets. Through component separation, one donation can produce Packed Red Blood Cells (PRBC - for anemia or blood loss), Platelets (for dengue or chemotherapy), and Fresh Frozen Plasma (FFP - for clotting disorders). Component therapy ensures the patient receives exactly what is clinically indicated."
  }
];

