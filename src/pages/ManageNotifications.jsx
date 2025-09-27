import React, { useState, useEffect } from 'react';
import { getNotifications, addNotification, editNotification, deleteNotification } from '../services/api';
import '../styles/styles.css';

export default function ManageNotifications() {
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
    <div className="page-container">
      <h1 className="page-title">Manage Notifications</h1>
      <div className="form-container">
        <input
          type="text"
          className="form-input"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
          placeholder="Enter notification message"
        />
        <button className="button" onClick={handleAddNotification}>Add Notification</button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td>{notification.message}</td>
                <td>
                  <button className="button" onClick={() => setEditingNotification(notification)}>Edit</button>
                  <button className="button" onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingNotification && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Edit Notification</h3>
            <input
              type="text"
              className="form-input"
              value={editingNotification.message}
              onChange={(e) => setEditingNotification({ ...editingNotification, message: e.target.value })}
            />
            <button className="button" onClick={handleEditNotification}>Save</button>
            <button className="button" onClick={() => setEditingNotification(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
