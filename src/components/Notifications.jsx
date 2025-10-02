import React from 'react';
import './Notifications.css';
import api from '../services/api';
import { useEffect } from 'react';

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
        setNotifications(res.data.details || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-list">
        {!notifications && notifications.map((notification) => (
          <div className="notification-card important" key={notification.value.id}>
            {console.log('notification: ', notification)}
            <div className="notification-header">
              <span className="notification-badge">{notification.value.type}</span>
              <span className="notification-time">{new Date(notification.value.created_at).toLocaleString()}</span>
            </div>

            <div className="notification-body">
              <h6 className="notification-subtitle">From: {notification.value.author}</h6>
              <p className="notification-text">{notification.value.content}</p>
            </div>
          </div>
        ))}
        {!notifications && <div>No notifications available.</div>}
      </div>
    </div>
  );
}