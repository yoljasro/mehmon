const Table = require('../models/Table');
const { createLog } = require('./logController');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a table
// @route   POST /api/tables
// @access  Private
exports.createTable = async (req, res) => {
  const { number, capacity, location } = req.body;

  try {
    const tableExists = await Table.findOne({ number });

    if (tableExists) {
      return res.status(400).json({ message: 'Table already exists' });
    }

    const table = await Table.create({
      number,
      capacity,
      location,
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
      table.status = req.body.status || table.status;

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
