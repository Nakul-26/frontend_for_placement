import React, { useState, useEffect } from 'react';
import { api, NotificationsApi } from '../services/api';
import toast from 'react-hot-toast';
import styles from './AdminNotifications.module.css';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setLoading(true);
      setError(null);
      const config = {
        withCredentials: true,
      };
      const response = await NotificationsApi.get('/notifications', config);
      if (Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
        toast.success('Notifications fetched successfully!');
      } else {
        setNotifications([]);
        throw new Error('API did not return an array for notifications');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error fetching notifications';
      setError(errorMessage);
      toast.error(errorMessage);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotification = async () => {
    setIsSubmitting(true);
    try {
      const config = {
        withCredentials: true,
      };
      await NotificationsApi.post('/notifications', newNotification, config);
      handleClose();
      fetchNotifications();
      toast.success('Notification added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNotification = async () => {
    setIsSubmitting(true);
    try {
      const config = {
        withCredentials: true,
      };
      await NotificationsApi.put(`/notifications/${editingNotification.id}`, editingNotification, config);
      handleClose();
      fetchNotifications();
      toast.success('Notification edited successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error editing notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setDeletingNotificationId(id);
    setIsSubmitting(true);
    try {
      const config = {
        withCredentials: true,
      };
      await NotificationsApi.delete(`/notifications/${id}`, config);
      handleClose();
      fetchNotifications();
      toast.success('Notification deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting notification');
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

  if (loading) {
    return <div className={styles.loading}>Loading notifications...</div>;
  }

  if (error) {
    return <div className={styles['error-message']}>Error: {error}</div>;
  }

  return (
    <div className={styles['admin-notifications-container']}>
      <div className={styles['admin-notifications-header']}>
        <h1 className={styles['admin-notifications-title']}>Manage Notifications</h1>
        <p className={styles['admin-notifications-subtitle']}>Create, edit, and delete notifications for all users.</p>
      </div>

      <div className={`${styles['admin-notifications-form-card']} ${styles.card}`}>
        <h2 className={styles['card-title']}>Add New Notification</h2>
        <div className={styles['modal-content']}>
          <input
            type="number"
            className={styles['form-input']}
            name="author_id"
            value={newNotification.author_id}
            onChange={handleNewNotificationChange}
            placeholder="Author ID"
          />
          <input
            type="text"
            className={styles['form-input']}
            name="author"
            value={newNotification.author}
            onChange={handleNewNotificationChange}
            placeholder="Author Name"
          />
          <textarea
            className={styles['form-textarea']}
            name="content"
            value={newNotification.content}
            onChange={handleNewNotificationChange}
            placeholder="Notification content..."
          ></textarea>
          <select
            className={styles['form-select']}
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
            className={styles['form-input']}
            name="expires_at"
            value={newNotification.expires_at}
            onChange={handleNewNotificationChange}
          />
        </div>
        <div className={styles['modal-actions']}>
          <button className={styles.button} onClick={handleAddNotification} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : <><AddIcon /> Add Notification</>}
          </button>
        </div>
      </div>

      <div className={styles['admin-notifications-grid']}>
        {notifications && notifications.map((notification) => (
          <div key={notification.id} className={styles['admin-notification-card']}>
            <div className={styles['admin-notification-card-header']}>
              <h2 className={styles['admin-notification-card-title']}>{notification.type} Notification</h2>
              <div className={styles['admin-notification-card-actions']}>
                <button className={styles.button} onClick={() => { setEditingNotification(notification); handleClickOpen(); }}><EditIcon /></button>
                <button className={styles.button} onClick={() => handleDeleteNotification(notification.id)} disabled={isSubmitting && deletingNotificationId === notification.id}>
                  {isSubmitting && deletingNotificationId === notification.id ? 'Deleting...' : <DeleteIcon />}
                </button>
              </div>
            </div>
            <div className={styles['admin-notification-card-body']}>
              <p><strong>Author:</strong> {notification.author} (ID: {notification.author_id})</p>
              <p><strong>Content:</strong> {notification.content}</p>
              <p><strong>Public:</strong> {notification.is_public ? 'Yes' : 'No'}</p>
              <p><strong>Expires:</strong> {notification.expires_at ? new Date(notification.expires_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>
        ))}
      </div>

      {open && (editingNotification) && (
        <div className={styles['modal-overlay']}>
          <div className={styles.modal}>
            <h3 className={styles['modal-title']}>Edit Notification</h3>
            <div className={styles['modal-content']}>
              <input
                type="text"
                className={styles['form-input']}
                name="author_id"
                value={editingNotification.author_id}
                onChange={handleEditingNotificationChange}
                placeholder="Author ID"
              />
              <input
                type="text"
                className={styles['form-input']}
                name="author"
                value={editingNotification.author}
                onChange={handleEditingNotificationChange}
                placeholder="Author Name"
              />
              <textarea
                className={styles['form-textarea']}
                name="content"
                value={editingNotification.content}
                onChange={handleEditingNotificationChange}
                placeholder="Notification content..."
              ></textarea>
              <select
                className={styles['form-select']}
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
                className={styles['form-input']}
                name="expires_at"
                value={editingNotification.expires_at ? editingNotification.expires_at.substring(0, 16) : ''}
                onChange={handleEditingNotificationChange}
              />
            </div>
            <div className={styles['modal-actions']}>
              <button className={styles.button} onClick={handleClose} disabled={isSubmitting}>Cancel</button>
              <button className={styles.button} onClick={handleEditNotification} disabled={isSubmitting}>
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