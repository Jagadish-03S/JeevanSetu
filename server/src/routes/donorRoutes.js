const express = require('express');
const router = express.Router();
const { 
  registerDonorProfile, 
  updateAvailability, 
  getMatchedRequestsForDonor, 
  respondToRequest 
} = require('../controllers/donorController');
const { authenticateToken, optionalAuthenticateToken } = require('../middleware/authMiddleware');

router.post('/register', optionalAuthenticateToken, registerDonorProfile); // Allows authenticated or confidential visitor registration
router.put('/availability', authenticateToken, updateAvailability);
router.get('/matched-requests', authenticateToken, getMatchedRequestsForDonor);
router.post('/respond', respondToRequest);

module.exports = router;
