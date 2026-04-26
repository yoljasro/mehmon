const Shift = require('../models/Shift');

// @desc    Get all shifts
// @route   GET /api/shifts
// @access  Private
exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find({ restaurantId: req.user.id }).sort({ date: -1 });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a shift
// @route   POST /api/shifts
// @access  Private
exports.createShift = async (req, res) => {
  const { staffName, startTime, endTime, date, notes } = req.body;
  try {
    const shift = await Shift.create({
      restaurantId: req.user.id,
      staffName,
      startTime,
      endTime,
      date,
      notes,
    });
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a shift
// @route   DELETE /api/shifts/:id
// @access  Private
exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findOne({ _id: req.params.id, restaurantId: req.user.id });
    if (shift) {
      await shift.deleteOne();
      res.json({ message: 'Shift removed' });
    } else {
      res.status(404).json({ message: 'Shift not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
