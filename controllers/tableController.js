const Table = require('../models/Table');
const Booking = require('../models/Booking');
const { createLog } = require('./logController');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    
    // Get current date and time for dynamic status
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Fetch all confirmed/completed bookings for today
    const bookingsToday = await Booking.find({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      status: { $in: ['confirmed', 'completed'] }
    });

    const tablesWithStatus = tables.map(table => {
      const tableObj = table.toObject();
      
      // Check if there is an active booking right now
      const activeBooking = bookingsToday.find(b => 
        b.tableId.toString() === table._id.toString() &&
        currentTimeStr >= b.timeSlot &&
        (b.endTime ? currentTimeStr <= b.endTime : true)
      );

      if (activeBooking) {
        tableObj.status = 'occupied';
        tableObj.currentBooking = activeBooking;
      } else {
        // Check if there is a booking in the near future (e.g., within next 30 mins) - optional but good
        tableObj.status = 'available';
      }

      return tableObj;
    });

    res.json(tablesWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a table
// @route   POST /api/tables
// @access  Private
exports.createTable = async (req, res) => {
  const { number, capacity, location, zone, x, y } = req.body;

  try {
    const tableExists = await Table.findOne({ number });

    if (tableExists) {
      return res.status(400).json({ message: 'Table already exists' });
    }

    const table = await Table.create({
      number,
      capacity,
      location,
      zone,
      x: x || 0,
      y: y || 0,
    });

    // Create activity log
    await createLog(req.user.id, 'Yangi stol', `${number}-raqamli stol qo'shildi`, req.user.name);

    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
// @access  Private
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (table) {
      table.number = req.body.number || table.number;
      table.capacity = req.body.capacity || table.capacity;
      table.location = req.body.location || table.location;
      table.zone = req.body.zone || table.zone;
      table.status = req.body.status || table.status;
      table.x = req.body.x !== undefined ? req.body.x : table.x;
      table.y = req.body.y !== undefined ? req.body.y : table.y;

      const updatedTable = await table.save();
      res.json(updatedTable);
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (table) {
      await table.deleteOne();
      res.json({ message: 'Table removed' });
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get detailed table information
// @route   GET /api/tables/:id/details
// @access  Private
exports.getTableDetails = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Fetch all bookings for this table today
    const bookings = await Booking.find({
      tableId: table._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      status: { $ne: 'cancelled' }
    }).sort({ timeSlot: 1 });

    const currentBooking = bookings.find(b => 
      currentTimeStr >= b.timeSlot && (b.endTime ? currentTimeStr <= b.endTime : true)
    );

    const upcomingBookings = bookings.filter(b => 
      b.timeSlot > currentTimeStr
    );

    res.json({
      table,
      currentBooking: currentBooking || null,
      upcomingBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
