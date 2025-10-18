
const { io } = require('socket.io-client');
const http = require('http');

const SERVER_URL = 'http://localhost:5001';
const TEST_USER_ID = 'test-user-123';

console.log('[client] Starting socket test client...');
const socket = io(SERVER_URL, { transports: ['websocket', 'polling'] });

socket.on('connect', () => {
  console.log('[client] Connected to server with socket id:', socket.id);
  socket.emit('authenticate', TEST_USER_ID.toString());
  console.log('[client] Sent authenticate for user:', TEST_USER_ID.toString());

  
  const req = http.request(
    SERVER_URL.replace('http://', '') + '/api/notifications/test',
    {
      method: 'POST',
      headers: {
        'x-test-user-id': TEST_USER_ID.toString(),
      },
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log('[client] Test notification POST response:', data);
      });
    }
  );

  req.on('error', (err) => console.error('[client] HTTP error:', err));
  req.end();
});

socket.on('newNotification', (payload) => {
  console.log('[client] Received newNotification:', JSON.stringify(payload));
  // Close after a short delay to allow logs to flush
  setTimeout(() => {
    console.log('[client] Closing client');
    socket.close();
    process.exit(0);
  }, 1000);
});

socket.on('disconnect', () => {
  console.log('[client] Disconnected from server');
});

socket.on('connect_error', (err) => {
  console.error('[client] Connection error:', err.message);
});

