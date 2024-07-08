const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Include chatRoutes
const path = require('path');
const http = require('http'); // Add this line
const socketIo = require('socket.io'); // Add this line

const app = express();
const server = http.createServer(app); // Change this line
const io = socketIo(server); // Add this line

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve files from uploads folder

app.use('/api', userRoutes); // Use /api for userRoutes
app.use('/api', chatRoutes); // Use /api for chatRoutes

// Handle socket connection
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('sendMessage', (message) => {
        console.log('Message received on server:', message);
        io.emit('message', message);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Change this line
