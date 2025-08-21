const express = require('express');
const router = express.Router();
const { signup, signin, getMe, searchUsers } = require('../controller/authController');
const { signupValidation, signinValidation } = require('../middleware/validation');
const { protect } = require('../config/jwt');
const User = require('../model/User');

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signupValidation, signup);

// @route   POST /api/auth/signin
// @desc    Login user
// @access  Public
router.post('/signin', signinValidation, signin);

 

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   GET /api/auth/search-users
// @desc    Search users
// @access  Private
router.get('/search-users', protect, searchUsers);

// Get current user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 