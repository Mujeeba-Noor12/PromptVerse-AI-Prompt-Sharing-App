// import React from 'react';
// import { useAuth } from '../../contexts/AuthContext';

// const NotificationTest = () => {
//   const { isAuthenticated } = useAuth();

//   const testNotification = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/notifications/test', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'x-test-user-id': 'test-user-123' // Use a test user ID
//         }
//       });

//       if (response.ok) {
//         console.log('Test notification sent successfully');
//         alert('Test notification sent! Check the notification bell.');
//       } else {
//         console.error('Failed to send test notification');
//         alert('Failed to send test notification');
//       }
//     } catch (error) {
//       console.error('Error sending test notification:', error);
//       alert('Error sending test notification');
//     }
//   };

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <button
//         onClick={testNotification}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Test Notification
//       </button>
//     </div>
//   );
// };

// export default NotificationTest; 
import React from 'react'

const NotificationTest = () => {
  return (
    <div></div>
  )
}

export default NotificationTest