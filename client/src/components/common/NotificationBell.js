import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaBell } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';
import { deleteNotification as deleteNotificationApi } from '../../api/notifications';

const NotificationBell = () => {
  const {
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    setNotifications,
    setUnreadCount,
  } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  console.log('NotificationBell render:', { unreadCount, notificationsCount: notifications.length, isAuthenticated });

  if (!isAuthenticated) {
    return null;
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);

    // Navigate to the relevant page based on notification type
    if (notification.prompt) {
      const promptId = typeof notification.prompt === 'string'
        ? notification.prompt
        : notification.prompt?._id;
      if (promptId) {
        window.location.href = `/prompts/${promptId}`;
      }
    }
  };

  const handleDelete = async (e, notification) => {
    e.stopPropagation();
    try {
      await deleteNotificationApi(notification._id);
      setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
      if (!notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const getDisplayMessage = (notification) => {
    const raw = typeof notification.message === 'string' ? notification.message : '';
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '""' || trimmed === "''") {
      switch (notification.type) {
        case 'like':
          return `${notification.sender?.username || 'Someone'} liked your prompt`;
        case 'comment':
          return `${notification.sender?.username || 'Someone'} commented on your prompt`;
        case 'reply':
          return `${notification.sender?.username || 'Someone'} replied to your comment`;
        case 'upvote':
          return `${notification.sender?.username || 'Someone'} upvoted your prompt`;
        case 'downvote':
          return `${notification.sender?.username || 'Someone'} downvoted your prompt`;
        case 'bookmark':
          return `${notification.sender?.username || 'Someone'} bookmarked your prompt`;
        case 'system':
        default:
          return 'New notification';
      }
    }
    // Remove wrapping quotes if present, e.g., "message" or 'message'
    const unquoted = trimmed.replace(/^['"](.*)['"]$/, '$1');
    return unquoted;
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="relative ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        {unreadCount > 0 ? (
          <IoMdNotifications className="w-6 h-6 text-blue-600" />
        ) : (
          <FaBell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 filter-bar">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 prompt-bar"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`filter-bar p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 ">
                      {notification.sender?.avatar ? (
                        <img
                          src={notification.sender.avatar}
                          alt={notification.sender.username}
                          className="w-8 h-8 rounded-full "
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center new">
                          <span className="text-sm font-medium text-gray-600  prompt-bar">
                            {notification.sender?.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 prompt-bar">
                        {getDisplayMessage(notification)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                    <button
                      aria-label="Delete notification"
                      className="ml-2 text-gray-400 hover:text-red-600"
                      onClick={(e) => handleDelete(e, notification)}
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 