const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const Table = require('../models/Table');

// @desc    Get dashboard summary analytics
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const totalBookings = await Booking.countDocuments({ date: { $gte: today, $lt: tomorrow } });
    const confirmedBookings = await Booking.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: 'pending' });
    
    const totalGuests = await Guest.countDocuments();
    const totalTables = await Table.countDocuments();
    
    // Dynamic occupancy: how many tables are currently occupied based on bookings
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const activeBookings = await Booking.find({
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['confirmed', 'completed'] }
    });

    const occupiedTablesCount = activeBookings.filter(b => 
      currentTimeStr >= b.timeSlot && (b.endTime ? currentTimeStr <= b.endTime : true)
    ).length;

    const occupancyRate = totalTables > 0 ? (occupiedTablesCount / totalTables) * 100 : 0;

    res.json({
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalGuests,
      totalTables,
      occupancyRate: Math.round(occupancyRate),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed reports for a date range
// @route   GET /api/analytics/reports
// @access  Private
exports.getReports = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const bookings = await Booking.find(filter).populate('tableId', 'number capacity');
    const totalBookings = bookings.length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    // Total revenue or guests for the period
    const totalGuests = bookings.reduce((sum, b) => sum + (b.numberOfGuests || 0), 0);

    res.json({
      period: { startDate, endDate },
      totalBookings,
      completed,
      cancelled,
      totalGuests,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
