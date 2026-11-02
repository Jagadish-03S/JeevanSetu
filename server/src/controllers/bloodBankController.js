const { v4: uuidv4 } = require('uuid');
const { inMemoryStore } = require('../config/db');

// List verified blood banks
const listBloodBanks = async (req, res) => {
  try {
    const { district, blood_group, component } = req.query;

    let banks = inMemoryStore.blood_banks.filter(b => b.isVerified);

    if (district) {
      banks = banks.filter(b => b.district.toLowerCase() === district.toLowerCase());
    }

    if (blood_group) {
      banks = banks.filter(b => {
        const stock = b.inventory?.[blood_group];
        if (!stock) return false;
        if (component) {
          const compKey = component.includes('PRBC') ? 'PRBC'
                        : component.includes('Platelet') ? 'Platelets'
                        : component.includes('Plasma') ? 'FFP'
                        : 'WholeBlood';
          return (stock[compKey] || 0) > 0;
        }
        return true;
      });
    }

    return res.json({
      success: true,
      count: banks.length,
      bloodBanks: banks
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error fetching blood banks.' });
  }
};

// Update blood bank component inventory
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { inventory } = req.body;

    const bank = inMemoryStore.blood_banks.find(b => b.id === id);
    if (!bank) {
      return res.status(404).json({ success: false, error: 'Blood bank not found.' });
    }

    if (inventory) {
      bank.inventory = inventory;
    }
    bank.lastUpdated = 'Just now (Verified)';

    // Audit Log
    inMemoryStore.audit_logs.push({
      id: uuidv4(),
      action: 'INVENTORY_UPDATED',
      actor_email: req.user?.email || 'staff',
      actor_role: 'bloodbank',
      resource_type: 'blood_bank',
      resource_id: bank.id,
      details: { bankName: bank.name, updatedBy: req.user?.full_name },
      created_at: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Blood bank inventory updated and verified.',
      lastUpdated: bank.lastUpdated,
      inventory: bank.inventory
    });
  } catch (err) {
    console.error('Error updating inventory:', err);
    return res.status(500).json({ success: false, error: 'Error updating inventory.' });
  }
};

module.exports = {
  listBloodBanks,
  updateInventory
};

