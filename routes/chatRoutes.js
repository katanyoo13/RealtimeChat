const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const router = express.Router();

// Save chat message
router.post('/messages', async (req, res) => {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
        return res.status(400).json({ message: 'Sender, receiver, and message are required' });
    }

    try {
        const newMessage = new ChatMessage({ sender, receiver, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Error saving message', error: error.message || error });
    }
});

// Fetch chat messages between two users
router.get('/messages/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;

    try {
        const messages = await ChatMessage.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        }).sort('timestamp');

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error: error.message || error });
    }
});

module.exports = router;
