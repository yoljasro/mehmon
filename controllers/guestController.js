const Guest = require('../models/Guest');
const Booking = require('../models/Booking');

// @desc    Get all guests
// @route   GET /api/guests
// @access  Private
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find().sort({ lastVisit: -1 });
    
    // Add derived fields for frontend cards
    const processedGuests = guests.map(guest => {
      const g = guest.toObject();
      if (g.visits && g.visits.length > 0) {
        const last = g.visits[g.visits.length - 1];
        g.lastVisitTableNumber = last.tableNumber;
        g.lastVisitGuestCount = last.numberOfGuests;
      } else {
        g.lastVisitTableNumber = null;
        g.lastVisitGuestCount = 0;
      }
      return g;
    });

    res.json(processedGuests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single guest by ID
// @route   GET /api/guests/:id
// @access  Private
exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (guest) {
      res.json(guest);
    } else {
      res.status(404).json({ message: 'Guest not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a guest
// @route   POST /api/guests
// @access  Private
exports.createGuest = async (req, res) => {
  const { name, phone, email, notes, isVIP } = req.body;

  try {
    const guestExists = await Guest.findOne({ phone });

    if (guestExists) {
      return res.status(400).json({ message: 'Guest with this phone already exists' });
    }

    const guest = await Guest.create({
      name,
      phone,
      email,
      notes,
      isVIP,
    });

    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a guest
// @route   PUT /api/guests/:id
// @access  Private
exports.updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (guest) {
      guest.name = req.body.name || guest.name;
      guest.phone = req.body.phone || guest.phone;
      guest.email = req.body.email || guest.email;
      guest.notes = req.body.notes || guest.notes;
      guest.isVIP = req.body.isVIP !== undefined ? req.body.isVIP : guest.isVIP;

      const updatedGuest = await guest.save();
      res.json(updatedGuest);
    } else {
      res.status(404).json({ message: 'Guest not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a guest
// @route   DELETE /api/guests/:id
// @access  Private
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (guest) {
      await guest.deleteOne();
      res.json({ message: 'Guest removed' });
    } else {
      res.status(404).json({ message: 'Guest not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get guests currently in hall
// @route   GET /api/guests/in-hall
// @access  Private
exports.getGuestsInHall = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // 1. Find active bookings for now
    const activeBookings = await Booking.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      status: { $in: ['confirmed', 'completed'] }
    });

    const currentBookings = activeBookings.filter(b => 
      currentTimeStr >= b.timeSlot && (b.endTime ? currentTimeStr <= b.endTime : true)
    );

    if (currentBookings.length === 0) {
      return res.json([]);
    }

    // 2. Get phones of guests in hall
    const phones = currentBookings.map(b => b.phone);

    // 3. Find guests by phone
    const guests = await Guest.find({ phone: { $in: phones } });

    // 4. Map guests to include their current table info and last visit info
    const processedGuests = guests.map(guest => {
      const g = guest.toObject();
      
      // Add last visit info
      if (g.visits && g.visits.length > 0) {
        const last = g.visits[g.visits.length - 1];
        g.lastVisitTableNumber = last.tableNumber;
        g.lastVisitGuestCount = last.numberOfGuests;
      } else {
        g.lastVisitTableNumber = null;
        g.lastVisitGuestCount = 0;
      }

      // Add current booking info
      const booking = currentBookings.find(b => b.phone === guest.phone);
      if (booking) {
        g.currentTableId = booking.tableId;
        g.bookingId = booking._id;
        g.bookingTimeSlot = booking.timeSlot;
        g.bookingEndTime = booking.endTime;
      }
      return g;
    });

    res.json(processedGuests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
