const { v4: uuidv4 } = require('uuid');
const { inMemoryStore } = require('../config/db');
const { matchDonorsForRequest } = require('../services/matchingService');
const { calculatePriorityIndex, scanDuplicateAnomalies } = require('../services/aiPrioritizationService');

// Submit new blood request
const createRequest = async (req, res) => {
  try {
    const {
      patient_name,
      patient_age,
      patient_gender,
      hospital_name,
      district,
      requisition_id,
      blood_group,
      component,
      units_requested,
      urgency_tier,
      required_datetime,
      requester_name,
      requester_phone,
      requester_relation,
      clinical_notes
    } = req.body;

    if (!patient_name || !hospital_name || !requisition_id || !blood_group || !units_requested || !requester_phone) {
      return res.status(400).json({
        success: false,
        error: 'Patient name, hospital name, requisition ID, blood group, units, and requester phone are mandatory.'
      });
    }

    const tracking_code = `REQ-2026-KA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest = {
      id: uuidv4(),
      tracking_code,
      patient_name,
      patient_age: patient_age ? parseInt(patient_age) : null,
      patient_gender: patient_gender || 'Other',
      requester_user_id: req.user ? req.user.id : null,
      requester_name: requester_name || req.user?.full_name || 'Authorized Requester',
      requester_phone,
      requester_relation: requester_relation || 'Physician / Relative',
      hospital_name,
      district: district || 'Bengaluru Urban',
      requisition_id,
      blood_group,
      component: component || 'Packed Red Blood Cells (PRBC)',
      units_requested: parseInt(units_requested),
      urgency_tier: urgency_tier || 'Urgent (< 12 hrs)',
      required_datetime: required_datetime || 'Urgent Schedule',
      clinical_notes: clinical_notes || '',
      status: 'Verification Pending', // Verification required before public broadcast
      priority_score: calculatePriorityIndex({ urgency_tier, component, blood_group }),
      verified_by: null,
      verified_at: null,
      matched_donors: [],
      consented_donors: [],
      created_at: new Date().toISOString()
    };

    // AI Duplicate & Abuse Check
    const anomalyCheck = scanDuplicateAnomalies(newRequest, inMemoryStore.blood_requests);
    if (anomalyCheck.isSuspicious) {
      inMemoryStore.abuse_reports.push({
        id: uuidv4(),
        reported_entity_type: 'blood_request',
        reported_entity_id: newRequest.id,
        reason: 'Automated Pattern Flag',
        description: anomalyCheck.flags.map(f => f.message).join(' | '),
        status: 'Pending',
        created_at: new Date().toISOString()
      });
    }

    inMemoryStore.blood_requests.unshift(newRequest);

    // Audit Log
    inMemoryStore.audit_logs.push({
      id: uuidv4(),
      action: 'BLOOD_REQUEST_SUBMITTED',
      actor_email: req.user?.email || requester_phone,
      actor_role: req.user?.roles?.[0] || 'requester',
      resource_type: 'blood_request',
      resource_id: newRequest.id,
      details: { tracking_code, hospital_name, blood_group, units_requested },
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Blood request logged successfully. Awaiting clinical desk verification.',
      request: newRequest
    });
  } catch (err) {
    console.error('Error creating request:', err);
    return res.status(500).json({ success: false, error: 'Internal server error submitting request.' });
  }
};

// List blood requests (filtered by status or district)
const listRequests = async (req, res) => {
  try {
    const { status, district, blood_group } = req.query;

    let results = inMemoryStore.blood_requests;

    if (status) {
      results = results.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (district) {
      results = results.filter(r => r.district.toLowerCase() === district.toLowerCase());
    }
    if (blood_group) {
      results = results.filter(r => r.blood_group === blood_group);
    }

    return res.json({
      success: true,
      count: results.length,
      requests: results
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching requests.' });
  }
};

// Get single request details by ID or tracking code
const getRequestByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const request = inMemoryStore.blood_requests.find(r => r.tracking_code === code || r.id === code);

    if (!request) {
      return res.status(404).json({ success: false, error: 'Blood request not found.' });
    }

    return res.json({
      success: true,
      request
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching request details.' });
  }
};

// Verify blood request (Hospital staff or Admin only)
const verifyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_notes } = req.body;

    const request = inMemoryStore.blood_requests.find(r => r.id === id || r.tracking_code === id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Blood request not found.' });
    }

    request.status = 'Verified';
    request.verified_by = req.user ? req.user.full_name : 'Dr. Hospital Duty Officer';
    request.verified_at = new Date().toISOString();
    request.verification_notes = verification_notes || 'Requisition confirmed with treating facility.';

    // Run matching
    const potentialMatches = matchDonorsForRequest(request, inMemoryStore.donor_profiles);
    request.matched_donors = potentialMatches.map(m => m.donor_id);
    if (potentialMatches.length > 0) {
      request.status = 'Matching in Progress';
    }

    // Audit Log
    inMemoryStore.audit_logs.push({
      id: uuidv4(),
      action: 'REQUEST_VERIFIED',
      actor_email: req.user?.email || 'hospital_staff',
      actor_role: 'hospital',
      resource_type: 'blood_request',
      resource_id: request.id,
      details: { verified_by: request.verified_by, matched_count: potentialMatches.length },
      created_at: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Request successfully verified and screened against voluntary donor pool.',
      request,
      matchedDonorsCount: potentialMatches.length
    });
  } catch (err) {
    console.error('Error verifying request:', err);
    return res.status(500).json({ success: false, error: 'Error during request verification.' });
  }
};

// Update request lifecycle status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const validStatuses = [
      'Submitted',
      'Verification Pending',
      'Verified',
      'Matching in Progress',
      'Donor Response Received',
      'Referred to Blood Bank',
      'Fulfilled',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const request = inMemoryStore.blood_requests.find(r => r.id === id || r.tracking_code === id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found.' });
    }

    const oldStatus = request.status;
    request.status = status;
    if (remarks) request.medical_note = remarks;

    // Audit Log
    inMemoryStore.audit_logs.push({
      id: uuidv4(),
      action: 'REQUEST_STATUS_UPDATED',
      actor_email: req.user?.email || 'staff',
      actor_role: req.user?.roles?.[0] || 'staff',
      resource_type: 'blood_request',
      resource_id: request.id,
      details: { oldStatus, newStatus: status, remarks },
      created_at: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `Status updated from '${oldStatus}' to '${status}'.`,
      request
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error updating status.' });
  }
};

module.exports = {
  createRequest,
  listRequests,
  getRequestByCode,
  verifyRequest,
  updateStatus
};

