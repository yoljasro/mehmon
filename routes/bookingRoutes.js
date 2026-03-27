const express = require('express');
const {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

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
 *               phone:
 *                 type: string
 *               tableId:
 *                 type: string
 *               date:
 *                 type: string
 *               timeSlot:
 *                 type: string
 *               numberOfGuests:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
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
 *               numberOfGuests:
 *                 type: number
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Booking updated
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
 */
router.route('/:id').put(updateBooking).delete(deleteBooking);

module.exports = router;
