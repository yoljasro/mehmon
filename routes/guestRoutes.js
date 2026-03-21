const express = require('express');
const {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
} = require('../controllers/guestController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.route('/').get(getGuests).post(createGuest);
router.route('/:id').get(getGuestById).put(updateGuest).delete(deleteGuest);

module.exports = router;
