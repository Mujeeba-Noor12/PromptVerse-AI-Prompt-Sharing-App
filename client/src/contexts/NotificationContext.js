import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getNotifications, getUnreadCount, markNotificationAsRead, markAllNotificationsAsRead } from '../api/notifications';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load notifications on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Setting up socket connection for user:', user._id);
     
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to notification server', newSocket.id);
    
        if (user && user._id) {
          newSocket.emit('authenticate', user._id.toString());
          console.log('Sent authenticate for user', user._id.toString());
        }
     
        loadNotifications();
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from notification server');
      });

      newSocket.on('newNotification', (data) => {
        console.log('Received new notification:', data);
        const { notification } = data;
        
      
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        toast.success(notification.message, {
          duration: 4000,
          position: 'top-right',
        });
      });

     
      newSocket.on('activity', (data) => {
        console.log('Received activity event:', data);
      
        const { message } = data || {};
        if (message) {
          toast(message, {
            duration: 3000,
            position: 'bottom-right',
          });
        }
      });

      setSocket(newSocket);

 
      return () => {
        console.log('Cleaning up socket connection');
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    setNotifications,
    setUnreadCount,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 