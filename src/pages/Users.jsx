import React from 'react';
import api from '../services/api.jsx';
import '../styles/styles.css';

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchField, setSearchField] = React.useState('email');

  const [editingUser, setEditingUser] = React.useState(null);
  const [newUser, setNewUser] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser(null);
    setEditingUser(null);
  };

  const fetchUsers = async (searchValue = '') => {
    const query = `
      query FindUsers($by: usersearch) {
        searchUsers(by: $by) {
          id name email created_at role { name description }
        }
      }
    `;
    const by = searchValue ? { [searchField]: searchValue } : {};
    try {
      setLoading(true);
      const res = await api.post(
        `/graphql`,
        { query, variables: { by } },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setUsers(res.data.data?.searchUsers || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers2 = async () => {
    const query = `
      query {
        users {
          id name email created_at role { name description }
        }
      }
    `;
    try {
      setLoading(true);
      const res = await api.post(
        `/graphql`,
        { query },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      setUsers(res.data.data?.users || []);
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
    try {
      setLoading(true);
      await api.delete(`/api/users/${id}`, {
        credentials: 'include',
      });
      await fetchUsers2();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        password: editingUser.password,
        role_id: editingUser.role_id,
      };

      await api.put(`/api/users/${editingUser.id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      handleClose();
      await fetchUsers2();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveNew = async () => {
    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role_id: newUser.role_id,
      };

      await api.post(`/api/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      handleClose();
      await fetchUsers2();
    } catch (err) {
      alert(err.message);
    }
  };

  React.useEffect(() => {
    fetchUsers2();
  }, []);

  React.useEffect(() => {
    if (search === '') return;
    const timeout = setTimeout(() => fetchUsers(search), 300);
    return () => clearTimeout(timeout);
  }, [search, searchField]);

  return (
    <div className="page-container">
      <h1 className="page-title">Users</h1>
      <div className="form-container">
        <div className="users-search-container">
          <input
            type="text"
            className="form-input"
            placeholder={`Search by ${searchField}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="email">Email</option>
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
          <button className="button" onClick={() => { setSearch(''); fetchUsers2(); }}>
            Reset
          </button>
          <button
            className="button"
            onClick={() => {
              setNewUser({ name: '', email: '', password: '', role_id: '' });
              handleClickOpen();
            }}
          >
            <AddIcon />
            Add User
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="users-table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role?.name}</td>
                <td className="users-table-actions">
                  <button className="button" onClick={() => {
                    setEditingUser(u);
                    handleClickOpen();
                  }}><EditIcon />Edit</button>
                  <button className="button" onClick={() => handleDelete(u.id)}><DeleteIcon />Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">{newUser ? 'Add User' : 'Edit User'}</h3>
            <div className="modal-content">
              <input
                autoFocus
                className="form-input"
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
                className="form-input"
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
                className="form-input"
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
                className="form-input"
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
            <div className="modal-actions">
              <button className="button" onClick={handleClose}>Cancel</button>
              <button className="button" onClick={newUser ? handleSaveNew : handleSaveEdit}>{newUser ? 'Add' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}