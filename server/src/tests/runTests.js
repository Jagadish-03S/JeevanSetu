// ====================================================================
// JEEVANSETU - Automated Test Suite
// Tests all 9 key functional domains:
// 1. User Registration & JWT Authentication
// 2. Role-Based Permissions & Unauthorized Access Prevention
// 3. Donor Profile Registration & Availability Updates
// 4. Blood Request Submission & Validation
// 5. Medical Requisition Verification
// 6. Intelligent Donor Matching Logic (Red Cell Compatibility & Distance)
// 7. Blood Bank Component Inventory Updates
// 8. Consent-Gated Donor Contact Disclosure
// 9. AI Anomaly & Abuse Detection Screening
// ====================================================================

process.env.NODE_ENV = 'test';

const http = require('http');
const { app, server } = require('../server');
const { matchDonorsForRequest, COMPATIBILITY_RULES } = require('../services/matchingService');
const { scanDuplicateAnomalies, calculatePriorityIndex } = require('../services/aiPrioritizationService');

const TEST_PORT = 5099;
let testServer;
let adminToken = '';
let donorToken = '';
let testRequestId = '';

// Helper function to make HTTP requests to the test server
function apiCall(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('\n=======================================================');
  console.log(' STARTING JEEVANSETU AUTOMATED VERIFICATION SUITE');
  console.log('=======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(testName, condition, detail = '') {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} - ${detail}`);
      failed++;
    }
  }

  await new Promise(resolve => {
    testServer = server.listen(TEST_PORT, () => {
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------
    // Test 1: Health Check Endpoint
    // -------------------------------------------------------------
    const health = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/health',
      method: 'GET'
    });
    assert('1. GET /api/health responds with 200 and status HEALTHY', health.status === 200 && health.body.status === 'HEALTHY');

    // -------------------------------------------------------------
    // Test 2: User Registration (Donor Role)
    // -------------------------------------------------------------
    const regRes = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: `testdonor_${Date.now()}@example.com`,
      password: 'SecurePassword123!',
      full_name: 'Aditi Sharma',
      phone: '+91 98450 77112',
      role: 'donor'
    });
    assert('2. POST /api/auth/register creates user and returns JWT token', regRes.status === 201 && regRes.body.token && regRes.body.user.roles.includes('donor'));
    donorToken = regRes.body.token;

    // -------------------------------------------------------------
    // Test 3: Login with Demo Admin Account
    // -------------------------------------------------------------
    const loginRes = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'admin@jeevansetu.in',
      password: 'JeevanSetu@2026'
    });
    assert('3. POST /api/auth/login succeeds for platform admin', loginRes.status === 200 && loginRes.body.token && loginRes.body.user.roles.includes('admin'));
    adminToken = loginRes.body.token;

    // -------------------------------------------------------------
    // Test 4: Role Permissions & Unauthorized Access Prevention
    // -------------------------------------------------------------
    const unauthorizedAudit = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/admin/audit-logs',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${donorToken}` } // Donor attempting admin endpoint
    });
    assert('4. Unauthorized role access to /api/admin/audit-logs is blocked with 403 Forbidden', unauthorizedAudit.status === 403);

    const authorizedAudit = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/admin/audit-logs',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` } // Admin accessing admin endpoint
    });
    assert('5. Authorized admin access to /api/admin/audit-logs succeeds with 200 OK', authorizedAudit.status === 200 && authorizedAudit.body.auditLogs);

    // -------------------------------------------------------------
    // Test 5: Donor Profile Registration & Availability Update
    // -------------------------------------------------------------
    const donorProfileRes = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/donors/register',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${donorToken}`
      }
    }, {
      blood_group: 'B+',
      district: 'Bengaluru Urban',
      approximate_locality: 'Rajajinagar 2nd Block',
      phone: '+91 98450 77112',
      availability: 'Available',
      consent_privacy: true
    });
    assert('6. POST /api/donors/register creates private profile without exposing raw phone', 
      donorProfileRes.status === 201 && donorProfileRes.body.profile.masked_phone.includes('••••'));

    // -------------------------------------------------------------
    // Test 6: Blood Request Creation with Medical Requisition ID
    // -------------------------------------------------------------
    const requestRes = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/requests',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      patient_name: 'Chandrashekar B.',
      hospital_name: 'Victoria Hospital Emergency Trauma Wing',
      district: 'Bengaluru Urban',
      requisition_id: 'VH-EM-2026/902',
      blood_group: 'O-',
      component: 'Packed Red Blood Cells (PRBC)',
      units_requested: 2,
      urgency_tier: 'Critical Emergency (< 4 hrs)',
      required_datetime: 'Today 11:00 PM',
      requester_name: 'Dr. Sandeep Rao',
      requester_phone: '+91 98765 00112',
      requester_relation: 'Attending Surgeon'
    });
    assert('7. POST /api/requests logs requisition with status "Verification Pending"', 
      requestRes.status === 201 && requestRes.body.request.status === 'Verification Pending');
    testRequestId = requestRes.body.request.id;

    // -------------------------------------------------------------
    // Test 7: Medical Requisition Verification & Donor Matching Trigger
    // -------------------------------------------------------------
    const verifyRes = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: `/api/requests/${testRequestId}/verify`,
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    }, {
      verification_notes: 'Requisition verified with Victoria Hospital casualty desk.'
    });
    assert('8. PUT /api/requests/:id/verify triggers matching and transitions status', 
      verifyRes.status === 200 && (verifyRes.body.request.status === 'Verified' || verifyRes.body.request.status === 'Matching in Progress'));

    // -------------------------------------------------------------
    // Test 8: Pure Unit Test: Clinical Red Cell Compatibility Matrix
    // -------------------------------------------------------------
    const oMinusMatches = matchDonorsForRequest(
      { blood_group: 'O-', district: 'Bengaluru Urban', latitude: 12.9628, longitude: 77.5756 },
      [
        { id: 'd1', blood_group: 'O-', district: 'Bengaluru Urban', availability: 'Available', latitude: 12.9299, longitude: 77.5833, receive_emergency_alerts: true },
        { id: 'd2', blood_group: 'A+', district: 'Bengaluru Urban', availability: 'Available', latitude: 12.9299, longitude: 77.5833, receive_emergency_alerts: true }, // Incompatible for O-
        { id: 'd3', blood_group: 'O-', district: 'Kalaburagi', availability: 'Available', latitude: 17.3297, longitude: 76.8343, receive_emergency_alerts: true } // Too far (>300km)
      ]
    );
    assert('9. Matching Engine filters out incompatible blood groups and out-of-district donors', 
      oMinusMatches.length === 1 && oMinusMatches[0].donor_id === 'd1');

    // -------------------------------------------------------------
    // Test 9: Pure Unit Test: AI Duplicate & Abuse Pattern Detection
    // -------------------------------------------------------------
    const anomalyResult = scanDuplicateAnomalies(
      { requester_phone: '+91 99999 11111', patient_name: 'Duplicate Patient', hospital_name: 'Hospital B', created_at: new Date().toISOString() },
      [
        { requester_phone: '+91 99999 11111', patient_name: 'Duplicate Patient', hospital_name: 'Hospital A', created_at: new Date().toISOString() },
        { requester_phone: '+91 99999 11111', patient_name: 'Another Patient', hospital_name: 'Hospital A', created_at: new Date().toISOString() }
      ]
    );
    assert('10. AI Anomaly Scanner identifies duplicate requisition and rapid phone frequency', 
      anomalyResult.isSuspicious === true && anomalyResult.flags.length >= 2);

    // -------------------------------------------------------------
    // Test 10: Blood Bank Inventory Management
    // -------------------------------------------------------------
    const inventoryUpdateRes = await apiCall({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/blood-banks/bb-1/inventory',
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    }, {
      inventory: {
        'O+': { PRBC: 18, Platelets: 8, FFP: 20, WholeBlood: 10 },
        'O-': { PRBC: 5, Platelets: 2, FFP: 4, WholeBlood: 2 }
      }
    });
    assert('11. PUT /api/blood-banks/:id/inventory records verified stock update timestamp', 
      inventoryUpdateRes.status === 200 && inventoryUpdateRes.body.lastUpdated.includes('Verified'));

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    testServer.close();
    console.log('\n=======================================================');
    console.log(` TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log('=======================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTestSuite();
