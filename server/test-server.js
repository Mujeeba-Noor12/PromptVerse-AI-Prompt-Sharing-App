const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { setSocketIO } = require('./routes/sendNotification');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (userId) => {
    const uid = userId ? userId.toString() : null;
    if (!uid) {
      console.log('Authenticate called without valid userId');
      return;
    }
    console.log('User authenticating:', uid, 'with socket:', socket.id);
    connectedUsers.set(uid, socket.id);
    socket.userId = uid;
    console.log(`User authenticated: ${uid} -> socket ${socket.id}`);
    console.log('Current connected users:', Array.from(connectedUsers.keys()));
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
      console.log('Remaining connected users:', Array.from(connectedUsers.keys()));
    }
  });
});

// Set up Socket.IO references for sendNotification
setSocketIO(io, connectedUsers);

// Test notification route
app.post('/api/notifications/test', (req, res) => {
  try {
    const userId = req.headers['x-test-user-id'] || 'test-user-123';
    console.log('Test notification triggered for user:', userId);
    
    // Send notification directly via Socket.IO
    const userSocketId = connectedUsers.get(userId);
    if (userSocketId) {
      console.log('Sending test notification to socket:', userSocketId);
      io.to(userSocketId).emit('newNotification', {
        notification: {
          _id: 'test-notification-' + Date.now(),
          user: userId,
          sender: userId,
          type: 'system',
          message: 'This is a test notification!',
          isRead: false,
          createdAt: new Date()
        }
      });
      console.log('Test notification sent successfully');
      res.json({ message: 'Test notification sent' });
    } else {
      console.log('User not connected to socket');
      res.json({ message: 'User not connected' });
    }
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedUsers: Array.from(connectedUsers.keys()),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('This server is for testing notifications without MongoDB');
  console.log('Update your client to connect to http://localhost:5001');
}); 