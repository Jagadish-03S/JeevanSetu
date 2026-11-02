// Standard Red Cell Transfusion Compatibility Configuration (Informational Guideline)
// NOTE: Compatibility and transfusion safety must ALWAYS be confirmed by blood bank cross-matching.
const COMPATIBILITY_RULES = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // Universal Donor
  'Bombay (hh)': ['Bombay (hh)']
};

// Haversine formula to compute distance in km between two lat/long points
function computeDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Calculate days between two ISO dates
function getDaysSinceLastDonation(dateString) {
  if (!dateString) return 999;
  const last = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - last);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Intelligent Donor Screening & Ranking Algorithm
 * Does NOT declare medical suitability; produces a privacy-preserving screened candidate ranking.
 */
function matchDonorsForRequest(request, donorPool) {
  const targetGroup = request.blood_group;
  const compatibleDonorGroups = COMPATIBILITY_RULES[targetGroup] || [targetGroup];

  const matched = [];

  for (const donor of donorPool) {
    // 1. Availability check
    if (donor.availability !== 'Available') continue;
    if (donor.receive_emergency_alerts === false) continue;

    // 2. Compatibility screening
    if (!compatibleDonorGroups.includes(donor.blood_group)) continue;

    // 3. District proximity filtering (must match district or nearby)
    const isSameDistrict = donor.district && request.district && 
      donor.district.toLowerCase() === request.district.toLowerCase();

    // 4. Approximate distance calculation if coordinates available
    const distanceKm = computeDistanceKm(
      request.latitude || 12.9628, 
      request.longitude || 77.5756, 
      donor.latitude, 
      donor.longitude
    ) || (isSameDistrict ? 5.0 : 45.0);

    // Limit to reasonable coordination radius (~30 km in urban areas)
    if (distanceKm > 35 && !isSameDistrict) continue;

    // 5. Screening interval check (informational)
    const daysSince = getDaysSinceLastDonation(donor.last_donation_date);
    const passesCoolingOff = daysSince >= 90;

    // 6. Ranking Score: Proximity (40 pts) + Exact Blood Group Match (40 pts) + Eligible Interval (20 pts)
    let score = 0;
    
    // Exact group gets higher priority than general universal donor
    if (donor.blood_group === targetGroup) {
      score += 40;
    } else {
      score += 25;
    }

    // Proximity component
    if (distanceKm <= 5) score += 40;
    else if (distanceKm <= 15) score += 30;
    else if (distanceKm <= 25) score += 20;
    else score += 10;

    // Interval component
    if (passesCoolingOff) score += 20;

    // 7. Sanitize output: STRICTLY hide donor phone number & exact GPS
    matched.push({
      donor_id: donor.id,
      display_name: donor.display_name,
      blood_group: donor.blood_group,
      district: donor.district,
      approximate_locality: donor.approximate_locality,
      estimated_distance_km: distanceKm,
      match_score: score,
      screening_interval_passed: passesCoolingOff,
      days_since_last_donation: daysSince,
      consent_status: donor.has_consented_requests?.[request.id] ? 'Consent Granted' : 'Pending'
    });
  }

  // Sort descending by match score
  matched.sort((a, b) => b.match_score - a.match_score);

  return matched;
}

module.exports = {
  COMPATIBILITY_RULES,
  computeDistanceKm,
  matchDonorsForRequest
};

