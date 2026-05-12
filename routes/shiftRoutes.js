const express = require('express');
const { getShifts, createShift, deleteShift } = require('../controllers/shiftController');
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
 *         description: List of shifts (newest first)
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
 *                     description: Always returned — filtered to current restaurant
 *                     example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                   staffName:
 *                     type: string
 *                     example: "Dilnoza Yusupova"
 *                   startTime:
 *                     type: string
 *                     example: "09:00"
 *                   endTime:
 *                     type: string
 *                     example: "17:00"
 *                   date:
 *                     type: string
 *                     example: "2026-05-12"
 *                   notes:
 *                     type: string
 *                     nullable: true
 *                     example: "Kechga qolishi mumkin"
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
 *                 example: "Dilnoza Yusupova"
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *               date:
 *                 type: string
 *                 example: "2026-05-12"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Kechga qolishi mumkin"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Shift removed"
 *       404:
 *         description: Shift not found
 */
router.delete('/:id', deleteShift);

module.exports = router;
