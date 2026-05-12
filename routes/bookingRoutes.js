const express = require('express');
const { getBookings, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     TableRef:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *         number:
 *           type: number
 *           example: 5
 *         capacity:
 *           type: number
 *           example: 4
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *         guestName:
 *           type: string
 *           example: "John Doe"
 *         phone:
 *           type: string
 *           example: "+998901234567"
 *         tableId:
 *           $ref: '#/components/schemas/TableRef'
 *         date:
 *           type: string
 *           example: "2026-05-01"
 *         timeSlot:
 *           type: string
 *           example: "18:30"
 *         endTime:
 *           type: string
 *           nullable: true
 *           example: "20:30"
 *         bookingType:
 *           type: string
 *           example: "Banket"
 *         numberOfGuests:
 *           type: number
 *           example: 6
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           example: "confirmed"
 *         notes:
 *           type: string
 *           nullable: true
 *           example: "Anniversary dinner"
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guestName
 *               - phone
 *               - tableId
 *               - date
 *               - timeSlot
 *               - numberOfGuests
 *             properties:
 *               guestName:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *               tableId:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *               date:
 *                 type: string
 *                 example: "2026-05-01"
 *               timeSlot:
 *                 type: string
 *                 example: "18:30"
 *               endTime:
 *                 type: string
 *                 example: "20:30"
 *               bookingType:
 *                 type: string
 *                 example: "Banket"
 *               numberOfGuests:
 *                 type: number
 *                 example: 2
 *               notes:
 *                 type: string
 *                 example: "Anniversary dinner"
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.route('/').get(getBookings).post(createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
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
 *               guestName:
 *                 type: string
 *               phone:
 *                 type: string
 *               tableId:
 *                 type: string
 *               date:
 *                 type: string
 *               timeSlot:
 *                 type: string
 *               endTime:
 *                 type: string
 *               bookingType:
 *                 type: string
 *               numberOfGuests:
 *                 type: number
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Booking updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
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
 *         description: Booking deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking removed"
 *       404:
 *         description: Booking not found
 */
router.route('/:id').put(updateBooking).delete(deleteBooking);

module.exports = router;
