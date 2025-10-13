import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import './Permissions.css';

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
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

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);

  const [newPermission, setNewPermission] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPermissionId, setDeletingPermissionId] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPermission(null);
    setEditingPermission(null);
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get(
        '/rbac/permissions',
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      console.log('fetchPermissions response:', Array.isArray(res.data.data) ? 'true' : 'false');

      setPermissions(
        Array.isArray(res.data.data)
          ? res.data.data
          : []
      );
    } catch (err) {
      console.error('fetchPermissions error:', err);
      setPermissions([]);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleSaveNew = async () => {
    if (!newPermission.name.trim()) return alert('Name is required');

    setIsSubmitting(true);
    try {
      const res = await api.post('/rbac/permissions', newPermission, { withCredentials: true });
      setPermissions([...permissions, res.data]);
      handleClose();

      await fetchPermissions();
      toast.success('Permission added successfully!');
    } catch (err) {
      alert('Failed to add permission');
      toast.error(err.response?.data?.message || 'Failed to add permission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.put(`/rbac/permissions/${editingPermission.id}`, editingPermission, { withCredentials: true });
      setPermissions(permissions.map(p => (p.id === editingPermission.id ? res.data : p)));
      handleClose();

      await fetchPermissions();
      toast.success('Permission updated successfully!');
    } catch (err) {
      alert('Failed to update permission');
      toast.error(err.response?.data?.message || 'Failed to update permission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this permission?')) return;
    setDeletingPermissionId(id);
    setIsSubmitting(true);
    try {
      await api.delete(`/rbac/permissions/${id}`, { withCredentials: true });
      setPermissions((prev) => prev.filter((perm) => perm.id !== id));
      toast.success('Permission deleted successfully!');
    } catch (err) {
      console.error('Error deleting permission:', err);
      toast.error(err.response?.data?.message || 'Failed to delete permission');
    } finally {
      setIsSubmitting(false);
      setDeletingPermissionId(null);
    }
  };
  

  return (
    <div className="page-container">
      <h1 className="page-title">Permissions</h1>
      <div className="form-container card">
        <button
          className="button"
          onClick={() => {
            setNewPermission({ name: '', description: '' });
            handleClickOpen();
          }}
        >
          <AddIcon />
          Add Permission
        </button>
      </div>
      <div className="table-container card">
        <table className="table">
          <thead className='head'>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th className="action-buttons">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id}>
                <td>{perm.id}</td>
                <td>{perm.name}</td>
                <td>{perm.description || '-'}</td>
                <td className="action-buttons">
                  {/* <button className="button" onClick={() => {
                    setEditingPermission(perm);
                    handleClickOpen();
                  }}><EditIcon />Edit</button> */}
                  <button className="button danger" onClick={() => handleDelete(perm.id)} disabled={isSubmitting && deletingPermissionId === perm.id}>
                    {isSubmitting && deletingPermissionId === perm.id ? 'Deleting...' : <><DeleteIcon />Delete</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="modal-overlay">
          <div className="modal card">
            <h3 className="modal-title">{newPermission ? 'Add Permission' : 'Edit Permission'}</h3>
            <div className="modal-content">
              <input
                autoFocus
                className="form-input"
                placeholder="Name"
                type="text"
                value={newPermission?.name || editingPermission?.name || ''}
                onChange={(e) => {
                  if (newPermission) {
                    setNewPermission({ ...newPermission, name: e.target.value });
                  } else {
                    setEditingPermission({ ...editingPermission, name: e.target.value });
                  }
                }}
              />
              <input
                className="form-input"
                placeholder="Description"
                type="text"
                value={newPermission?.description || editingPermission?.description || ''}
                onChange={(e) => {
                  if (newPermission) {
                    setNewPermission({ ...newPermission, description: e.target.value });
                  } else {
                    setEditingPermission({ ...editingPermission, description: e.target.value });
                  }
                }}
              />
            </div>
            <div className="modal-actions">
              <button className="button secondary" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
              <button className="button" onClick={newPermission ? handleSaveNew : handleSaveEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (newPermission ? 'Add' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};