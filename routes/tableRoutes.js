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

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tables
 *   post:
 *     summary: Create a new table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - capacity
 *             properties:
 *               number:
 *                 type: string
 *                 example: "T-01"
 *               capacity:
 *                 type: number
 *                 example: 4
 *               location:
 *                 type: string
 *                 example: "Main Hall"
 *     responses:
 *       201:
 *         description: Table created
 */
router.route('/').get(getTables).post(createTable);

/**
 * @swagger
 * /api/tables/{id}:
 *   put:
 *     summary: Update a table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 example: "T-01"
 *               capacity:
 *                 type: number
 *                 example: 4
 *               location:
 *                 type: string
 *                 example: "Main Hall"
 *     responses:
 *       200:
 *         description: Table updated
 *   delete:
 *     summary: Delete a table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table deleted
 */
router.route('/:id').put(updateTable).delete(deleteTable);

module.exports = router;
