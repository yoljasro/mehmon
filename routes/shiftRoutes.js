const express = require('express');
const { getShifts, createShift, updateShift, deleteShift } = require('../controllers/shiftController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Get all shifts for the authenticated restaurant
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
 *               assignedTables:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Shift created
 */
router.route('/').get(getShifts).post(createShift);

/**
 * @swagger
 * /api/shifts/{id}:
 *   put:
 *     summary: Update a shift
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               assignedTables:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Shift updated
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
router.route('/:id').put(updateShift).delete(deleteShift);

module.exports = router;
