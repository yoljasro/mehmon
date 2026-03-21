const Guest = require('../models/Guest');

// @desc    Get all guests
// @route   GET /api/guests
// @access  Private
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
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
