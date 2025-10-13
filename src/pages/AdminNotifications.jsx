import React, { useState, useEffect } from 'react';
import { api, NotificationsApi } from '../services/api';
import './AdminNotifications.css'; // New CSS file for the combined page

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
  </svg>
);

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    author_id: 0,
    author: '',
    content: '',
    type: 'general',
    is_public: true,
    expires_at: '',
  });
  const [editingNotification, setEditingNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNotificationId, setDeletingNotificationId] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewNotification({
      author_id: 0,
      author: '',
      content: '',
      type: 'general',
      is_public: true,
      expires_at: '',
    });
    setEditingNotification(null);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
      } else {
        console.warn('API did not return an array for notifications:', response.data);
        setNotifications([]); // Default to empty array if not an array
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]); // Also set to empty array on error
    }
  };

  const handleAddNotification = async () => {
    setIsSubmitting(true);

    try {
      console.log('Adding notification:', newNotification);
      const config = {
        withCredentials: true,
      };
      const response = await NotificationsApi.post('/notifications', {
        author_id: newNotification.author_id,
        author: newNotification.author,
        content: newNotification.content,
        type: newNotification.type,
        is_public: newNotification.is_public,
        expires_at: newNotification.expires_at,
        config,
      });
      console.log('Notification added successfully:', response.data);
      handleClose();
      fetchNotifications();
    } catch (error) {
      console.error('Error adding notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNotification = async () => {
    setIsSubmitting(true);
    try {
      await editNotification(editingNotification.id, editingNotification);
      handleClose();
      fetchNotifications();
    } catch (error) {
      console.error('Error editing notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setDeletingNotificationId(id);
    setIsSubmitting(true);
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setIsSubmitting(false);
      setDeletingNotificationId(null);
    }
  };

  const handleNewNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewNotification((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditingNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingNotification((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="admin-notifications-container">
      <div className="admin-notifications-header">
        <h1 className="admin-notifications-title">Manage Notifications</h1>
        <p className="admin-notifications-subtitle">Create, edit, and delete notifications for all users.</p>
      </div>

      <div className="admin-notifications-form-card card">
        <h2 className="card-title">Add New Notification</h2>
        <div className="modal-content">
          <input
            type="number"
            className="form-input"
            name="author_id"
            value={newNotification.author_id}
            onChange={handleNewNotificationChange}
            placeholder="Author ID"
          />
          <input
            type="text"
            className="form-input"
            name="author"
            value={newNotification.author}
            onChange={handleNewNotificationChange}
            placeholder="Author Name"
          />
          <textarea
            className="form-textarea"
            name="content"
            value={newNotification.content}
            onChange={handleNewNotificationChange}
            placeholder="Notification content..."
          ></textarea>
          <select
            className="form-select"
            name="type"
            value={newNotification.type}
            onChange={handleNewNotificationChange}
          >
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            {/* <option value="Urgent">Urgent</option> */}
            <option value="info">Info</option>
            <option value="alert">Alert</option>
            <option value="warning">Warning</option>
          </select>
          <label>
            <input
              type="checkbox"
              name="is_public"
              checked={newNotification.is_public}
              onChange={handleNewNotificationChange}
            />
            Is Public
          </label>
          <input
            type="datetime-local"
            className="form-input"
            name="expires_at"
            value={newNotification.expires_at}
            onChange={handleNewNotificationChange}
          />
        </div>
        <div className="modal-actions">
          <button className="button" onClick={handleAddNotification} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : <><AddIcon /> Add Notification</>}
          </button>
        </div>
      </div>

      <div className="admin-notifications-grid">
        {/* <h2 className="admin-notifications-grid-title">All Noti fications</h2> */}
        {console.log(notifications)}
        {notifications && notifications.map((notification) => (
          <div key={notification.id} className="admin-notification-card">
            <div className="admin-notification-card-header">
              <h2 className="admin-notification-card-title">{notification.type} Notification</h2>
              <div className="admin-notification-card-actions">
                <button className="button" onClick={() => { setEditingNotification(notification); handleClickOpen(); }}><EditIcon /></button>
                <button className="button" onClick={() => handleDeleteNotification(notification.id)} disabled={isSubmitting && deletingNotificationId === notification.id}>
                  {isSubmitting && deletingNotificationId === notification.id ? 'Deleting...' : <DeleteIcon />}
                </button>
              </div>
            </div>
            <div className="admin-notification-card-body">
              <p><strong>Author:</strong> {notification.author} (ID: {notification.author_id})</p>
              <p><strong>Content:</strong> {notification.content}</p>
              <p><strong>Public:</strong> {notification.is_public ? 'Yes' : 'No'}</p>
              <p><strong>Expires:</strong> {notification.expires_at ? new Date(notification.expires_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>
        ))}
      </div>

      {open && (editingNotification) && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Edit Notification</h3>
            <div className="modal-content">
              <input
                type="text"
                className="form-input"
                name="author_id"
                value={editingNotification.author_id}
                onChange={handleEditingNotificationChange}
                placeholder="Author ID"
              />
              <input
                type="text"
                className="form-input"
                name="author"
                value={editingNotification.author}
                onChange={handleEditingNotificationChange}
                placeholder="Author Name"
              />
              <textarea
                className="form-textarea"
                name="content"
                value={editingNotification.content}
                onChange={handleEditingNotificationChange}
                placeholder="Notification content..."
              ></textarea>
              <select
                className="form-select"
                name="type"
                value={editingNotification.type}
                onChange={handleEditingNotificationChange}
              >
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                {/* <option value="Urgent">Urgent</option> */}
                <option value="info">Info</option>
                <option value="alert">Alert</option>
                <option value="warning">Warning</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={editingNotification.is_public}
                  onChange={handleEditingNotificationChange}
                />
                Is Public
              </label>
              <input
                type="datetime-local"
                className="form-input"
                name="expires_at"
                value={editingNotification.expires_at ? editingNotification.expires_at.substring(0, 16) : ''}
                onChange={handleEditingNotificationChange}
              />
            </div>
            <div className="modal-actions">
              <button className="button" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
              <button className="button" onClick={handleEditNotification} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;