const express = require('express');
const router = express.Router();
const { getAnalytics, getAuditLogs, getAbuseReports } = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/analytics', getAnalytics);
router.get('/audit-logs', authenticateToken, authorizeRoles('admin'), getAuditLogs);
router.get('/abuse-reports', authenticateToken, authorizeRoles('admin'), getAbuseReports);

module.exports = router;

