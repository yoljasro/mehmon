const express = require('express');
const { getShifts, createShift, deleteShift } = require('../controllers/shiftController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Get all shifts
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shifts
 *   post:
 *     summary: Create a new shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffName
 *               - startTime
 *               - endTime
 *               - date
 *             properties:
 *               staffName:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               date:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shift created
 */
router.route('/').get(getShifts).post(createShift);

/**
 * @swagger
 * /api/shifts/{id}:
 *   delete:
 *     summary: Delete a shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shift deleted
 */
router.delete('/:id', deleteShift);

module.exports = router;
