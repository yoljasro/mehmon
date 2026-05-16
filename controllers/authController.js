const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createLog } = require('./logController');

// Generate Tokens
// Access token: 15 minutes, Refresh token: 30 days
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, phone, cafeName, password } = req.body;

  try {
    const userExists = await User.findOne({ phone });

    if (userExists) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    const user = await User.create({
      name,
      phone,
      cafeName,
      password,
    });
    if (user) {
      // Create activity log
      await createLog(user._id, 'Ro\'yxatdan o\'tish', `Yangi foydalanuvchi: ${user.name}`, user.name, 'other');

      res.status(201).json({
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          cafeName: user.cafeName,
          role: user.role,
          isSetupCompleted: user.isSetupCompleted,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create activity log
      await createLog(user._id, 'Kirish', `Foydalanuvchi tizimga kirdi`, user.name, 'other');

      res.json({
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          cafeName: user.cafeName,
          role: user.role,
          isSetupCompleted: user.isSetupCompleted,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (restaurant details)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.imageUrl = req.body.imageUrl || user.imageUrl;
      user.institutionType = req.body.institutionType || user.institutionType;
      user.address = req.body.address || user.address;
      user.openingTime = req.body.openingTime || user.openingTime;
      user.closingTime = req.body.closingTime || user.closingTime;
      user.zones = req.body.zones || user.zones;
      user.isSetupCompleted = req.body.isSetupCompleted !== undefined ? req.body.isSetupCompleted : user.isSetupCompleted;
      user.cafeName = req.body.cafeName || user.cafeName;
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone; // Added phone update

      const updatedUser = await user.save();

      // Create activity log
      await createLog(updatedUser._id, 'Profil yangilandi', `Restoran ma'lumotlari tahrirlandi`, updatedUser.name, 'other');

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        cafeName: updatedUser.cafeName,
        imageUrl: updatedUser.imageUrl,
        institutionType: updatedUser.institutionType,
        address: updatedUser.address,
        openingTime: updatedUser.openingTime,
        closingTime: updatedUser.closingTime,
        zones: updatedUser.zones,
        isSetupCompleted: updatedUser.isSetupCompleted,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
