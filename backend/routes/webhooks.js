const express = require('express');
const Lead = require('../models/Lead');
const router = express.Router();

// Facebook Lead Ads Webhook
router.post('/facebook', async (req, res) => {
  try {
    const leadData = req.body;
    
    const lead = new Lead({
      name: leadData.full_name,
      phone: leadData.phone_number,
      email: leadData.email,
      source: 'facebook',
      sourceDetails: leadData,
      createdBy: process.env.ADMIN_ID // Set default admin ID
    });

    await lead.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Facebook webhook error:', error);
    res.status(500).json({ success: false });
  }
});

// Similar endpoints for Instagram, WhatsApp, etc.

module.exports = router;