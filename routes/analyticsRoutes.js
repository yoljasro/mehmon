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
 *         description: Summary stats for today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBookings:
 *                   type: number
 *                   example: 12
 *                 confirmedBookings:
 *                   type: number
 *                   example: 8
 *                 pendingBookings:
 *                   type: number
 *                   example: 3
 *                 totalGuests:
 *                   type: number
 *                   example: 245
 *                 totalTables:
 *                   type: number
 *                   example: 20
 *                 occupancyRate:
 *                   type: number
 *                   description: Percentage (0–100)
 *                   example: 40
 */
router.get('/summary', protect, getSummary);

/**
 * @swagger
 * /api/analytics/reports:
 *   get:
 *     summary: Get historical reports for a date range
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         example: "2026-05-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         example: "2026-05-31"
 *     responses:
 *       200:
 *         description: Historical report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       example: "2026-05-01"
 *                     endDate:
 *                       type: string
 *                       example: "2026-05-31"
 *                 totalBookings:
 *                   type: number
 *                   example: 120
 *                 completed:
 *                   type: number
 *                   example: 95
 *                 cancelled:
 *                   type: number
 *                   example: 10
 *                 totalGuests:
 *                   type: number
 *                   example: 480
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 */
router.get('/reports', protect, getReports);

module.exports = router;
