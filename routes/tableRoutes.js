const express = require('express');
const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect); // All table routes are protected

router.route('/').get(getTables).post(createTable);
router.route('/:id').put(updateTable).delete(deleteTable);

module.exports = router;
