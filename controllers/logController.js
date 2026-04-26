const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activity-log
// @access  Private
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ restaurantId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create a log
exports.createLog = async (restaurantId, action, details, performedBy) => {
  try {
    await ActivityLog.create({
      restaurantId,
      action,
      details,
      performedBy,
    });
  } catch (error) {
    console.error('Failed to create activity log:', error.message);
  }
};
