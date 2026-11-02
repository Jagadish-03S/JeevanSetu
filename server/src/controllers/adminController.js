const { v4: uuidv4 } = require('uuid');
const { inMemoryStore } = require('../config/db');

// Platform telemetry metrics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = inMemoryStore.users.length;
    const activeDonors = inMemoryStore.donor_profiles.filter(d => d.availability === 'Available').length;
    const verifiedBanks = inMemoryStore.blood_banks.filter(b => b.isVerified).length;
    const totalRequests = inMemoryStore.blood_requests.length;
    const openRequests = inMemoryStore.blood_requests.filter(r => r.status !== 'Fulfilled' && r.status !== 'Cancelled').length;
    const fulfilledRequests = inMemoryStore.blood_requests.filter(r => r.status === 'Fulfilled').length;

    return res.json({
      success: true,
      telemetry: {
        totalUsers,
        activeDonors,
        verifiedBanks,
        totalRequests,
        openRequests,
        fulfilledRequests,
        pilotDistrict: 'Karnataka State Pilot',
        status: 'Operational'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching telemetry.' });
  }
};

// List audit logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = [...inMemoryStore.audit_logs].reverse().slice(0, 50);
    return res.json({
      success: true,
      count: logs.length,
      auditLogs: logs
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching audit logs.' });
  }
};

// List abuse reports
const getAbuseReports = async (req, res) => {
  try {
    return res.json({
      success: true,
      reports: inMemoryStore.abuse_reports
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching abuse reports.' });
  }
};

module.exports = {
  getAnalytics,
  getAuditLogs,
  getAbuseReports
};

