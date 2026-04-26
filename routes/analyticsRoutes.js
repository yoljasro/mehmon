const express = require('express');
const { getSummary, getReports } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get dashboard summary statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary stats
 */
router.get('/summary', protect, getSummary);

/**
 * @swagger
 * /api/analytics/reports:
 *   get:
 *     summary: Get historical reports
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historical report
 */
router.get('/reports', protect, getReports);

module.exports = router;
