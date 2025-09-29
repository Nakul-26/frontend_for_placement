import React, { useState, useEffect } from 'react';
import { getNotifications, addNotification, editNotification, deleteNotification } from '../services/api';
import './ManageNotifications.css';

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState('');
  const [editingNotification, setEditingNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleAddNotification = async () => {
    try {
      await addNotification({ message: newNotification });
      setNewNotification('');
      fetchNotifications();
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const handleEditNotification = async () => {
    try {
      await editNotification(editingNotification.id, { message: editingNotification.message });
      setEditingNotification(null);
      fetchNotifications();
    } catch (error) {
      console.error('Error editing notification:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="header-section">
        <h1>Manage Notifications</h1>
        <p>Create, edit, and delete notifications for all users.</p>
      </div>

      <div className="form-card card">
        <input
          type="text"
          className="form-input"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
          placeholder="Enter a new notification message..."
        />
        <button className="button primary" onClick={handleAddNotification}>Add Notification</button>
      </div>

      <div className="notifications-list card">
        <h2 className="card-title">Existing Notifications</h2>
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <p className="notification-message">{notification.message}</p>
            <div className="action-buttons">
              <button className="button" onClick={() => setEditingNotification(notification)}>Edit</button>
              <button className="button danger" onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingNotification && (
        <div className="modal-overlay">
          <div className="modal card">
            <h3 className="modal-title">Edit Notification</h3>
            <textarea
              className="form-textarea"
              value={editingNotification.message}
              onChange={(e) => setEditingNotification({ ...editingNotification, message: e.target.value })}
            ></textarea>
            <div className="modal-actions">
              <button className="button primary" onClick={handleEditNotification}>Save Changes</button>
              <button className="button secondary" onClick={() => setEditingNotification(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNotifications;
