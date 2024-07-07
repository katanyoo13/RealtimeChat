const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String }, // เพิ่มฟิลด์สำหรับเก็บที่อยู่รูปภาพ
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'offline' },
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
