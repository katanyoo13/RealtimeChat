const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'offline' },
    role: { type: String, default: 'user' },
    profilePicture: { type: String, default: '' } // Add this line
});

module.exports = mongoose.model('User', UserSchema);
