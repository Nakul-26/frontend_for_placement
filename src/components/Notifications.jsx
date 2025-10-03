import React from 'react';
import './Notifications.css';
import api from '../services/api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Notifications() {
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const config = {
            withCredentials: true,
        }
        const res = await api.get('https://notification-31at.onrender.com/alldata', config);
        console.log('notifications res: ', res);
        setNotifications(res.data.details ? res.data.details.map(item => item.value) : []);
        setError(null);
      } catch (err) {
        console.error('fetchNotifications error:', err);
        setError(err.message || 'Failed to fetch notifications');
        toast.error(err.response?.data?.message || 'Failed to fetch notifications');
        setNotifications([]); // Clear notifications on error
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-list">
        {!notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className="notification-card important" key={notification.id}>
              <div className="notification-header">
                <span className="notification-badge">{notification.type}</span>
                <span className="notification-time">{new Date(notification.created_at).toLocaleString()}</span>
              </div>

              <div className="notification-body">
                <h6 className="notification-subtitle">From: {notification.author}</h6>
                <p className="notification-text">{notification.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div>No notifications available.</div>
        )}
      </div>
    </div>
  );
}