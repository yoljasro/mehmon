const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - cafeName
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               cafeName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "def456cd-7890-4abc-defg-hijklmn12345"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                     name:
 *                       type: string
 *                       example: "Jasur Saidaliyev"
 *                     phone:
 *                       type: string
 *                       example: "+998901234567"
 *                     cafeName:
 *                       type: string
 *                       example: "Mehmon Cafe"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         description: Bad request
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "def456cd-7890-4abc-defg-hijklmn12345"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                     name:
 *                       type: string
 *                       example: "Jasur Saidaliyev"
 *                     phone:
 *                       type: string
 *                       example: "+998901234567"
 *                     cafeName:
 *                       type: string
 *                       example: "Mehmon Cafe"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         description: Unauthorized
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get restaurant profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update restaurant profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *               institutionType:
 *                 type: string
 *               address:
 *                 type: string
 *               openingTime:
 *                 type: string
 *               closingTime:
 *                 type: string
 *               cafeName:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', protect, logoutUser);

module.exports = router;
