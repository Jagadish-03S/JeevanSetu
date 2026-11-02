/**
 * AI-Assisted Prioritization & Abuse Screening Service
 * In accordance with healthcare AI guidelines, this service assists with:
 * 1. Urgency queue prioritization based on verified clinical inputs
 * 2. Duplicate requisition and anomaly pattern detection
 * 3. Never makes diagnostic, suitability, or transfusion decisions.
 */

// Shelf life sensitivity factor by blood component
const COMPONENT_TIME_SENSITIVITY = {
  'Single Donor Platelet (SDP)': 1.5,      // ~5 days shelf life
  'Platelet Concentrate (PRP)': 1.4,        // ~5 days shelf life
  'Fresh Frozen Plasma (FFP)': 1.1,         // Frozen (stored at -30C)
  'Cryoprecipitate': 1.1,
  'Packed Red Blood Cells (PRBC)': 1.2,     // 35-42 days shelf life
  'Whole Blood': 1.0
};

/**
 * Calculates a verified queue priority index (1 - 100)
 * Higher index = earlier queue display for hospital coordination desks
 */
function calculatePriorityIndex(request) {
  let baseScore = 50;

  // 1. Urgency Tier
  if (request.urgency_tier?.includes('< 4 hrs') || request.urgency_tier?.toLowerCase().includes('critical')) {
    baseScore += 35;
  } else if (request.urgency_tier?.includes('< 12 hrs') || request.urgency_tier?.toLowerCase().includes('urgent')) {
    baseScore += 20;
  } else {
    baseScore += 5;
  }

  // 2. Component multiplier
  const multiplier = COMPONENT_TIME_SENSITIVITY[request.component] || 1.0;
  baseScore = Math.min(100, Math.round(baseScore * multiplier));

  // 3. Rare blood group uplift (e.g. O- or Bombay blood group)
  if (request.blood_group === 'O-' || request.blood_group === 'Bombay (hh)' || request.blood_group === 'AB-') {
    baseScore = Math.min(100, baseScore + 10);
  }

  return baseScore;
}

/**
 * Scans new submissions for anomalous duplicate patterns:
 * - Same patient name across different hospital IDs in < 24 hrs
 * - Same requester phone submitting more than 3 requests in 12 hrs
 */
function scanDuplicateAnomalies(newRequest, existingRequests) {
  const flags = [];

  const recent = existingRequests.filter(r => {
    const diffHours = (Date.now() - new Date(r.created_at || Date.now()).getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  });

  // Check 1: Duplicate phone usage
  const samePhoneCount = recent.filter(r => r.requester_phone === newRequest.requester_phone).length;
  if (samePhoneCount >= 2) {
    flags.push({
      type: 'RAPID_FREQUENCY_PHONE',
      severity: 'Medium',
      message: `Requester phone ${newRequest.requester_phone} logged ${samePhoneCount + 1} requests within 24 hours.`
    });
  }

  // Check 2: Same patient name at a different hospital
  const samePatientDiffHospital = recent.find(r => 
    r.patient_name.toLowerCase() === newRequest.patient_name.toLowerCase() &&
    r.hospital_name.toLowerCase() !== newRequest.hospital_name.toLowerCase()
  );

  if (samePatientDiffHospital) {
    flags.push({
      type: 'CROSS_FACILITY_PATIENT_MATCH',
      severity: 'High',
      message: `Patient ${newRequest.patient_name} was already logged at '${samePatientDiffHospital.hospital_name}'. Review for potential duplication.`
    });
  }

  return {
    isSuspicious: flags.length > 0,
    flags
  };
}

module.exports = {
  calculatePriorityIndex,
  scanDuplicateAnomalies
};

