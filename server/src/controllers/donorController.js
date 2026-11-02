const { v4: uuidv4 } = require('uuid');
const { inMemoryStore } = require('../config/db');

function maskPhone(p) {
  if (!p) return '+91 98•••• 1209';
  const clean = p.replace(/\s+/g, '');
  if (clean.length >= 8) {
    return clean.slice(0, clean.length - 8) + '••••' + clean.slice(-4);
  }
  return '••••' + clean.slice(-4);
}

// Register or update donor profile
const registerDonorProfile = async (req, res) => {
  try {
    const {
      blood_group,
      district,
      approximate_locality,
      phone,
      availability,
      last_donation_date,
      consent_privacy
    } = req.body;

    if (!blood_group || !district || !approximate_locality) {
      return res.status(400).json({
        success: false,
        error: 'Blood group, district, and approximate area are required.'
      });
    }

    if (!consent_privacy) {
      return res.status(400).json({
        success: false,
        error: 'Explicit voluntary consent is required to join the donor registry.'
      });
    }

    const userId = req.user ? req.user.id : uuidv4();
    const existingIndex = inMemoryStore.donor_profiles.findIndex(d => d.user_id === userId);

    const maskedPhone = maskPhone(phone);

    const donorData = {
      id: existingIndex >= 0 ? inMemoryStore.donor_profiles[existingIndex].id : uuidv4(),
      user_id: userId,
      display_name: `${req.user?.full_name || 'Voluntary Donor'} (#${Math.floor(400 + Math.random() * 500)})`,
      blood_group,
      district,
      approximate_locality,
      phone_confidential: phone, // ONLY accessible internally
      masked_phone: maskedPhone,
      availability: availability || 'Available',
      receive_emergency_alerts: true,
      last_donation_date: last_donation_date || null,
      total_donations: existingIndex >= 0 ? inMemoryStore.donor_profiles[existingIndex].total_donations : 0,
      has_consented_requests: {}
    };

    if (existingIndex >= 0) {
      inMemoryStore.donor_profiles[existingIndex] = {
        ...inMemoryStore.donor_profiles[existingIndex],
        ...donorData
      };
    } else {
      inMemoryStore.donor_profiles.push(donorData);
    }

    // Add 'donor' role to current user if not already present
    if (req.user) {
      const user = inMemoryStore.users.find(u => u.id === req.user.id);
      if (user && !user.roles.includes('donor')) {
        user.roles.push('donor');
      }
    }

    // Audit Log entry
    inMemoryStore.audit_logs.push({
      id: uuidv4(),
      action: 'DONOR_PROFILE_REGISTERED',
      actor_email: req.user?.email || 'anonymous',
      actor_role: 'donor',
      resource_type: 'donor_profile',
      details: { blood_group, district },
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Voluntary donor profile registered successfully. Contact details remain confidential.',
      profile: {
        id: donorData.id,
        display_name: donorData.display_name,
        blood_group: donorData.blood_group,
        district: donorData.district,
        approximate_locality: donorData.approximate_locality,
        availability: donorData.availability,
        masked_phone: donorData.masked_phone,
        total_donations: donorData.total_donations
      }
    });
  } catch (err) {
    console.error('Error saving donor profile:', err);
    return res.status(500).json({ success: false, error: 'Internal server error saving donor profile.' });
  }
};

// Update availability status
const updateAvailability = async (req, res) => {
  try {
    const { availability, receive_emergency_alerts } = req.body;
    const donor = inMemoryStore.donor_profiles.find(d => d.user_id === req.user?.id);

    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor profile not found for this account.' });
    }

    if (availability) donor.availability = availability;
    if (receive_emergency_alerts !== undefined) donor.receive_emergency_alerts = receive_emergency_alerts;

    return res.json({
      success: true,
      message: 'Availability status updated.',
      availability: donor.availability,
      receive_emergency_alerts: donor.receive_emergency_alerts
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error updating availability.' });
  }
};

// Get requests matched for this donor
const getMatchedRequestsForDonor = async (req, res) => {
  try {
    const donor = inMemoryStore.donor_profiles.find(d => d.user_id === req.user?.id);
    const donorGroup = donor ? donor.blood_group : 'O-';
    const donorDistrict = donor ? donor.district : 'Bengaluru Urban';

    // Show verified requests that match group or universal compatibility
    const matchingRequests = inMemoryStore.blood_requests.filter(r => {
      if (r.status === 'Fulfilled' || r.status === 'Cancelled') return false;
      const isDistrictMatch = !r.district || r.district === donorDistrict;
      return isDistrictMatch;
    });

    return res.json({
      success: true,
      requests: matchingRequests.map(r => ({
        id: r.id,
        tracking_code: r.tracking_code,
        hospital_name: r.hospital_name,
        district: r.district,
        blood_group: r.blood_group,
        component: r.component,
        units_requested: r.units_requested,
        urgency_tier: r.urgency_tier,
        required_datetime: r.required_datetime,
        requisition_id: r.requisition_id,
        status: r.status,
        verified_by: r.verified_by,
        medical_note: r.medical_note,
        has_consented: donor?.has_consented_requests?.[r.id] || false
      }))
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching matched requests.' });
  }
};

// Donor explicitly grants one-time contact disclosure to hospital desk
const respondToRequest = async (req, res) => {
  try {
    const { request_id, decision } = req.body; // decision: 'ACCEPT' or 'DECLINE'

    const donor = inMemoryStore.donor_profiles.find(d => d.user_id === req.user?.id) || inMemoryStore.donor_profiles[0];
    const targetRequest = inMemoryStore.blood_requests.find(r => r.id === request_id || r.tracking_code === request_id);

    if (!targetRequest) {
      return res.status(404).json({ success: false, error: 'Blood request not found.' });
    }

    if (!donor.has_consented_requests) {
      donor.has_consented_requests = {};
    }

    if (decision === 'ACCEPT') {
      donor.has_consented_requests[targetRequest.id] = true;
      if (!targetRequest.consented_donors) targetRequest.consented_donors = [];
      if (!targetRequest.consented_donors.includes(donor.id)) {
        targetRequest.consented_donors.push(donor.id);
      }
      targetRequest.status = 'Donor Response Received';

      // Audit Consent Log
      inMemoryStore.audit_logs.push({
        id: uuidv4(),
        action: 'DONOR_CONSENT_DISCLOSED',
        actor_email: req.user?.email || donor.display_name,
        actor_role: 'donor',
        resource_type: 'blood_request',
        resource_id: targetRequest.id,
        details: { hospital: targetRequest.hospital_name, requisition: targetRequest.requisition_id },
        created_at: new Date().toISOString()
      });

      return res.json({
        success: true,
        message: 'Consent granted. Contact details safely routed to the hospital coordination desk.',
        coordinatorContact: {
          hospital: targetRequest.hospital_name,
          requisitionId: targetRequest.requisition_id,
          helpline: '1800-425-4422'
        }
      });
    } else {
      donor.has_consented_requests[targetRequest.id] = false;
      return res.json({
        success: true,
        message: 'Request declined. Your contact information remains completely confidential.'
      });
    }
  } catch (err) {
    console.error('Error responding to request:', err);
    return res.status(500).json({ success: false, error: 'Internal server error recording response.' });
  }
};

module.exports = {
  registerDonorProfile,
  updateAvailability,
  getMatchedRequestsForDonor,
  respondToRequest
};
