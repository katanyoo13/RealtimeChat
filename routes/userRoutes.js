const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const jwtSecret = 'your_secret_key'; // เปลี่ยนเป็นคีย์ลับของคุณ

// Register route
router.post('/register', async (req, res) => {
  const { username, password, confirm_password, email } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      created_at: new Date(),
      status: 'offline',
      role: 'user'
    });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Error details:', error); // แสดงข้อผิดพลาดในคอนโซล
    res.status(500).json({ message: 'Error registering user', error: error.message || error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('User found:', user); // เพิ่มการตรวจสอบ
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error('Error details:', error); // แสดงข้อผิดพลาดในคอนโซล
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message || error });
  }
});

// Get all users route
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message || error });
  }
});

module.exports = router;
