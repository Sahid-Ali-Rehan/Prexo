const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Fetch all users
router.get('/fetch-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    const userData = users.map(user => ({
      username: user.fullname,
      email: user.email,
      uid: user._id,
      role: user.role
    }));
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Change user role
router.put('/role/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = user.role === 'customer' ? 'admin' : 'customer';
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Fetch Single User Data by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User fetched successfully', user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;