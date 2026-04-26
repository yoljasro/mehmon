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
 *         description: List of activity logs
 */
router.get('/', protect, getActivityLogs);

module.exports = router;
