const express = require('express');
const { getActivityLogs } = require('../controllers/logController');
const { protect } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/activity-log:
 *   get:
 *     summary: Get recent activity logs
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of activity logs (last 50, newest first)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                   restaurantId:
 *                     type: string
 *                     example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                   type:
 *                     type: string
 *                     enum: [booking_created, booking_updated, booking_cancelled, check_in, other]
 *                     example: "booking_created"
 *                   action:
 *                     type: string
 *                     example: "Yangi band qilish"
 *                   details:
 *                     type: string
 *                     example: "John Doe uchun 5-stol band qilindi"
 *                   performedBy:
 *                     type: string
 *                     example: "Jasur Saidaliyev"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-05-12T08:30:00.000Z"
 */
router.get('/', protect, getActivityLogs);

module.exports = router;
