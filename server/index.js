const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { setSocketIO } = require('./routes/sendNotification');


// dotenv.config();

dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET);


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/promptverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000, 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Please make sure MongoDB is running or check your connection string');
  console.log('You can install MongoDB from: https://www.mongodb.com/try/download/community');
  console.log('Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
});

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  
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

  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
      console.log('Remaining connected users:', Array.from(connectedUsers.keys()));
    }
  });
});


setSocketIO(io, connectedUsers);


app.set('io', io);
app.set('connectedUsers', connectedUsers);


app.use('/api/auth', require('./routes/auth'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 