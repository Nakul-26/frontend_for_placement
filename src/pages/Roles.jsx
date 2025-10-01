import { use, useEffect, useState } from 'react';
import api from '../services/api.jsx';
import './Roles.css';

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

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRole, setNewRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewRole(null);
    setEditingRole(null);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // console.log('api: ',  api);
        setLoading(true);
        const res = await api.get('/cookies', { withCredentials: true });
        // console.log('res: ', res.data.cookies);
        setToken(res.data.cookies);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch token');
        setLoading(false);
        return;
      }
    };
    fetchToken();
  }, []);

  const fetchRoles = async () => {
    try {
      console.log('fetching roles ...');
      console.log('token: ', token);
      console.log('fetching roles ... & api: ',  api);
      setLoading(true);
      const config = {
          // Keep withCredentials if you expect a cookie, otherwise remove it
          withCredentials: true, 
          headers: { 
              'Authorization': `Bearer ${token}`
              // Content-Type is optional for GET
          }
      }
      const res = await api.get('/rbac/roles', config);
      console.log('res: ', res);
      setRoles(res.data.data.roles || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNew = async () => {
    try {
      await api.post('/rbac/roles', newRole, { withCredentials: true });
      handleClose();
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/rbac/roles/${editingRole.id}`, editingRole, {
        withCredentials: true,
      });
      handleClose();
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/rbac/api/roles/${id}`, { withCredentials: true });
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [token]);

  return (
    <div className="page-container">
      <h1 className="page-title">Roles</h1>
      <div className="form-container">
        <button
          className="button"
          onClick={() => {
            setNewRole({ name: '', description: '', is_Active: true });
            handleClickOpen();
          }}
        >
          <AddIcon />
          Add Role
        </button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th className="roles-table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td>{role.is_Active ? 'Active' : 'Inactive'}</td>
                <td className="roles-table-actions">
                  <button className="button" onClick={() => {
                    setEditingRole(role);
                    handleClickOpen();
                  }}><EditIcon />Edit</button>
                  <button className="button" onClick={() => handleDelete(role.id)}><DeleteIcon />Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">{newRole ? 'Add Role' : 'Edit Role'}</h3>
            <div className="modal-content">
              <input
                autoFocus
                className="form-input"
                placeholder="Name"
                type="text"
                value={newRole?.name || editingRole?.name || ''}
                onChange={(e) => {
                  if (newRole) {
                    setNewRole({ ...newRole, name: e.target.value });
                  } else {
                    setEditingRole({ ...editingRole, name: e.target.value });
                  }
                }}
              />
              <input
                className="form-input"
                placeholder="Description"
                type="text"
                value={newRole?.description || editingRole?.description || ''}
                onChange={(e) => {
                  if (newRole) {
                    setNewRole({ ...newRole, description: e.target.value });
                  } else {
                    setEditingRole({ ...editingRole, description: e.target.value });
                  }
                }}
              />
              <select
                className="form-select"
                value={newRole?.is_Active || editingRole?.is_Active || true}
                onChange={(e) => {
                  if (newRole) {
                    setNewRole({ ...newRole, is_Active: e.target.value === 'true' });
                  } else {
                    setEditingRole({ ...editingRole, is_Active: e.target.value === 'true' });
                  }
                }}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="button" onClick={handleClose}>Cancel</button>
              <button className="button" onClick={newRole ? handleSaveNew : handleSaveEdit}>{newRole ? 'Add' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}