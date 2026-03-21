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

router.route('/').get(getBookings).post(createBooking);
router.route('/:id').put(updateBooking).delete(deleteBooking);

module.exports = router;
