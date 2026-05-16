const Shift = require('../models/Shift');

// @desc    Get all shifts
// @route   GET /api/shifts
// @access  Private
exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find({ restaurantId: req.user.id })
      .populate('assignedTables', 'number zone')
      .sort({ date: -1 });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a shift
// @route   POST /api/shifts
// @access  Private
exports.createShift = async (req, res) => {
  const { staffName, startTime, endTime, date, notes, assignedTables } = req.body;
  try {
    const shift = await Shift.create({
      restaurantId: req.user.id,
      staffName,
      startTime,
      endTime,
      date,
      notes,
      assignedTables,
    });
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a shift
// @route   PUT /api/shifts/:id
// @access  Private
exports.updateShift = async (req, res) => {
  try {
    const shift = await Shift.findOne({ _id: req.params.id, restaurantId: req.user.id });

    if (shift) {
      shift.staffName = req.body.staffName || shift.staffName;
      shift.startTime = req.body.startTime || shift.startTime;
      shift.endTime = req.body.endTime || shift.endTime;
      shift.date = req.body.date || shift.date;
      shift.notes = req.body.notes || shift.notes;
      shift.assignedTables = req.body.assignedTables || shift.assignedTables;

      const updatedShift = await shift.save();
      const populatedShift = await Shift.findById(updatedShift._id).populate('assignedTables', 'number zone');
      res.json(populatedShift);
    } else {
      res.status(404).json({ message: 'Shift not found' });
    }
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
