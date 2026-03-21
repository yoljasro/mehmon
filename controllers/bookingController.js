const Booking = require('../models/Booking');
const Table = require('../models/Table');
const Guest = require('../models/Guest');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('tableId', 'number capacity');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  const { guestName, phone, tableId, date, timeSlot, numberOfGuests, notes } = req.body;

  try {
    // 1. Check if table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // 2. Check for overlapping bookings for the same table at the same time
    const existingBooking = await Booking.findOne({
      tableId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Table is already booked for this time slot' });
    }

    // 3. Create or update Guest
    let guest = await Guest.findOne({ phone });
    if (guest) {
      guest.visitCount += 1;
      guest.lastVisit = Date.now();
      if (notes) guest.notes = notes;
      await guest.save();
    } else {
      guest = await Guest.create({
        name: guestName,
        phone,
        notes,
      });
    }

    // 4. Create booking
    const booking = await Booking.create({
      guestName,
      phone,
      tableId,
      date,
      timeSlot,
      numberOfGuests,
      notes,
    });

    // 5. Update table status if booking is for today (simplified)
    // In a real app, this would be managed by a more complex scheduler
    // table.status = 'booked';
    // await table.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a booking status
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = req.body.status || booking.status;
      // Other fields could be updated here too
      
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      await booking.deleteOne();
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
