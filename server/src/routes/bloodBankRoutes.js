const express = require('express');
const router = express.Router();
const { listBloodBanks, updateInventory } = require('../controllers/bloodBankController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', listBloodBanks);
router.put('/:id/inventory', authenticateToken, authorizeRoles('hospital', 'bloodbank', 'admin'), updateInventory);

module.exports = router;

