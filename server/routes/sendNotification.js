const Notification = require('../models/notification');
const User = require('../models/User');

let ioInstance = null;
let connectedUsersMap = null;

function setSocketIO(socketIO, users) {
  ioInstance = socketIO;
  connectedUsersMap = users;
  console.log('[sendNotification] setSocketIO called. Connected users keys:', users ? Array.from(users.keys()) : []);
}

async function sendNotification({ userId, senderId, type, promptId, commentId, message }) {
  try {
    console.log('[sendNotification] called with:', { userId, senderId, type, promptId, commentId });

    if (!userId) {
      console.log('[sendNotification] missing userId');
      return;
    }

    // Keep existing behavior: skip self-notifications
    if (senderId && userId.toString() === senderId.toString()) {
      console.log('[sendNotification] Skipping notification - same user');
      return;
    }

    try {
      const recipient = await User.findById(userId).select('notificationPreferences');
      const prefs = recipient?.notificationPreferences || {};
      if (prefs.muteAll) return;
      if (prefs.types && prefs.types[type] === false) return;
    } catch (prefErr) {
    }

    const notification = new Notification({
      user: userId,
      sender: senderId,
      type,
      prompt: promptId,
      comment: commentId,
      message
    });

    await notification.save();
    console.log('[sendNotification] Notification saved to DB:', notification._id);

    const uid = userId.toString();

    if (ioInstance && connectedUsersMap) {
      const connectedKeys = Array.from(connectedUsersMap.keys());
      console.log('[sendNotification] Connected users (keys):', connectedKeys);

      const socketId = connectedUsersMap.get(uid);
      console.log('[sendNotification] Lookup socket for user', uid, '=>', socketId);

      if (socketId) {
        ioInstance.to(socketId).emit('newNotification', {
          notification: {
            _id: notification._id,
            user: notification.user,
            sender: notification.sender,
            type: notification.type,
            prompt: notification.prompt,
            comment: notification.comment,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt
          }
        });
        console.log('[sendNotification] Emitted to socket', socketId);
      } else {
        console.log(`[sendNotification] User ${uid} not connected - relying on DB`);
      }

      try {
        const senderUid = senderId ? senderId.toString() : null;
        const broadcastedUserIds = [];

        for (const [connectedUserId, connectedSocketId] of connectedUsersMap.entries()) {
          if (connectedUserId === uid) {
            continue; 
          }
          if (senderUid && connectedUserId === senderUid) {
            continue; 
          }
          ioInstance.to(connectedSocketId).emit('activity', {
            type,
            promptId,
            commentId,
            message,
            senderId,
            recipientId: uid,
            notificationId: notification._id,
            createdAt: notification.createdAt
          });
          broadcastedUserIds.push(connectedUserId);
        }

        console.log('[sendNotification] Broadcasted activity to users:', broadcastedUserIds);
      } catch (broadcastErr) {
        console.error('[sendNotification] activity broadcast error:', broadcastErr);
      }
    } else {
      console.log('[sendNotification] Socket.IO not available');
    }
  } catch (err) {
    console.error('[sendNotification] error:', err);
  }
}

module.exports = { sendNotification, setSocketIO };
