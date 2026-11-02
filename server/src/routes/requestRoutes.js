const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  listRequests, 
  getRequestByCode, 
  verifyRequest, 
  updateStatus 
} = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', createRequest);
router.get('/', listRequests);
router.get('/:code', getRequestByCode);
router.put('/:id/verify', authenticateToken, authorizeRoles('hospital', 'bloodbank', 'admin'), verifyRequest);
router.put('/:id/status', authenticateToken, authorizeRoles('hospital', 'bloodbank', 'admin'), updateStatus);

module.exports = router;

