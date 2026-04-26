const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/settings/pos:
 *   get:
 *     summary: Get POS integration settings
 *     tags: [Settings]
 */
router.get('/pos', (req, res) => {
  res.json({
    status: 'Not Integrated',
    availableIntegrations: ['Jowi', 'IIKO', 'Poster'],
  });
});

/**
 * @swagger
 * /api/settings/about:
 *   get:
 *     summary: Get app info
 *     tags: [Settings]
 */
router.get('/about', (req, res) => {
  res.json({
    version: '1.0.0',
    description: 'Mehmon Business Management System',
    support: '+998901234567',
  });
});

module.exports = router;
