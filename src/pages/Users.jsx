import React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api.js';
import styles from './Users.module.css';

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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('email');

  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser(null);
    setEditingUser(null);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rbac/users', { withCredentials: true });
      console.log('users res: ', res);
      setUsers(res.data.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingUserId(id);
    setIsSubmitting(true);
    try {
      await api.delete(`/users/${id}`, { withCredentials: true });
      await fetchUsers();
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
      setDeletingUserId(null);
    }
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        password: editingUser.password,
        role_id: editingUser.role_id,
      };

      await api.put(`/users/${editingUser.id}`, payload, { withCredentials: true });

      handleClose();
      await fetchUsers();
      toast.success('User updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNew = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role_id: newUser.role_id,
      };

      await api.post('/users/register', payload, { withCredentials: true });

      handleClose();
      await fetchUsers();
      toast.success('User added successfully!');
    } catch (err) {
      console.error('Error adding new user:', err);
      toast.error(err.response?.data?.message || 'Failed to add user');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles['users-container']}>
      <div className={styles['users-header']}>
        <h1 className={styles['users-title']}>Users</h1>
        <p className={styles['users-subtitle']}>Manage all users in the system.</p>
      </div>

      <div className={styles['users-search-container']}>
        <input
          type="text"
          className={styles['form-input']}
          placeholder={`Search by ${searchField}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles['form-select']}
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="email">Email</option>
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
        <button className={styles.button} onClick={() => { setSearch(''); fetchUsers(); }}>
          Reset
        </button>
        <button
          className={styles.button}
          onClick={() => {
            setNewUser({ name: '', email: '', password: '', role_id: '' });
            handleClickOpen();
          }}
        >
          <AddIcon />
          Add User
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className={styles['users-grid']}>
        {users.map((u) => (
          <div key={u.id} className={styles['user-card']}>
            <div className={styles['user-card-header']}>
              <h2 className={styles['user-card-title']}>{u.name}</h2>
              <div className={styles['user-card-actions']}>
                <button className={styles.button} onClick={() => { setEditingUser(u); handleClickOpen(); }}><EditIcon /></button>
                <button className={styles.button} onClick={() => handleDelete(u.id)} disabled={isSubmitting && deletingUserId === u.id}>
                  {isSubmitting && deletingUserId === u.id ? 'Deleting...' : <DeleteIcon />}
                </button>
              </div>
            </div>
            <div className={styles['user-card-body']}>
              <p><strong>ID:</strong> {u.id}</p>
              <p><strong>Name:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Role:</strong> {u.role_id}</p>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className={styles['modal-overlay']}>
          <div className={styles.modal}>
            <h3 className={styles['modal-title']}>{newUser ? 'Add User' : 'Edit User'}</h3>
            <div className={styles['modal-content']}>
              <input
                autoFocus
                className={styles['form-input']}
                placeholder="Name"
                type="text"
                value={newUser?.name || editingUser?.name || ''}
                onChange={(e) => {
                  if (newUser) {
                    setNewUser({ ...newUser, name: e.target.value });
                  } else {
                    setEditingUser({ ...editingUser, name: e.target.value });
                  }
                }}
              />
              <input
                className={styles['form-input']}
                placeholder="Email"
                type="email"
                value={newUser?.email || editingUser?.email || ''}
                onChange={(e) => {
                  if (newUser) {
                    setNewUser({ ...newUser, email: e.target.value });
                  } else {
                    setEditingUser({ ...editingUser, email: e.target.value });
                  }
                }}
              />
              <input
                className={styles['form-input']}
                placeholder="Password"
                type="password"
                onChange={(e) => {
                  if (newUser) {
                    setNewUser({ ...newUser, password: e.target.value });
                  } else {
                    setEditingUser({ ...editingUser, password: e.target.value });
                  }
                }}
              />
              <input
                className={styles['form-input']}
                placeholder="Role ID"
                type="number"
                value={newUser?.role_id || editingUser?.role_id || ''}
                onChange={(e) => {
                  if (newUser) {
                    setNewUser({ ...newUser, role_id: e.target.value });
                  } else {
                    setEditingUser({ ...editingUser, role_id: e.target.value });
                  }
                }}
              />
            </div>
            <div className={styles['modal-actions']}>
              <button className={styles.button} onClick={handleClose} disabled={isSubmitting}>Cancel</button>
              <button className={styles.button} onClick={newUser ? handleSaveNew : handleSaveEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (newUser ? 'Add' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}