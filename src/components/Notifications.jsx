import React from 'react';
import './Notifications.css';
import api from '../services/api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Notifications() {
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const config = {
            withCredentials: true,
        }
        const res = await api.get(`${import.meta.env.VITE_NOTIFICATIONS_URL}/alldata`, config);
        console.log('notifications res: ', res);
        setNotifications(res.data.details ? res.data.details.map(item => item.value) : []);
      } catch (err) {
        console.error('fetchNotifications error:', err);
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
      <h1>Notifications</h1>
      {/* <br /> */}
      {/* <br /> */}
      <div className="notifications-list">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className="notification-card important" key={notification.id}>
              <div className="notification-header">
                <span className="notification-badge">{notification.type}</span>
                <span className="notification-time">{notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}</span>
              </div>

              <div className="notification-body">
                <h6 className="notification-subtitle">From: {notification.author} (ID: {notification.author_id || 'N/A'})</h6>
                <p className="notification-text">{notification.content}</p>
                <p className="notification-text">Public: {notification.is_public ? 'Yes' : 'No'}</p>
                {/* <p className="notification-text">Expires: {notification.expires_at ? new Date(notification.expires_at).toLocaleString() : 'Never'}</p> */}
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