const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const path = require('path');

const router = express.Router();
const jwtSecret = 'your_secret_key'; // เปลี่ยนเป็นคีย์ลับของคุณ

// ตั้งค่าการอัพโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

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
        res.json({ success: true, token, role: user.role, username: user.username });
    } catch (error) {
        console.error('Error details:', error); // แสดงข้อผิดพลาดในคอนโซล
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message || error });
    }
});

// Get current user route
router.get('/currentUser', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        User.findById(decoded.id, 'username profilePicture')
            .then(user => {
                res.json(user);
            })
            .catch(error => {
                res.status(500).json({ message: 'Error fetching user', error: error.message || error });
            });
    });
});

// Get all users route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username profilePicture');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message || error });
    }
});

// Update profile route
router.post('/updateProfile', upload.single('profilePicture'), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const updatedData = { username: req.body.username };
            if (req.file) {
                updatedData.profilePicture = req.file.filename;
            }
            const updatedUser = await User.findByIdAndUpdate(decoded.id, updatedData, { new: true });
            res.json({ message: 'Profile updated', user: updatedUser });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Error updating profile', error: error.message || error });
        }
    });
});

module.exports = router;
