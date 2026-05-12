const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png, gif, webp). Max size 5MB.
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://kardise.engineering/uploads/1715500000000-123456.jpg"
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, uploadImage);

module.exports = router;
