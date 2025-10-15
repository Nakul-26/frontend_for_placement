import { useEffect, useState } from 'react';
import { api } from '../services/api';
// import './Roles.css';

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

  const [newRole, setNewRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewRole(null);
    setEditingRole(null);
  };

  const fetchRoles = async () => {
    try {
      console.log('fetching roles ...');
      console.log('fetching roles ... & api: ',  api);
      const config = {
          withCredentials: true, 
      }
      const res = await api.get('/rbac/roles', config);
      console.log('roles res: ', res.data.data);
      setRoles(res.data.data || []);
    } catch (err) {
      alert(err.message || 'Failed to fetch roles');
    }
  };

  const handleSaveNew = async () => {
    setIsSubmitting(true);
    try {
      console.log('newRole: ', newRole);
      await api.post('/rbac/roles', newRole, { withCredentials: true });
      await createRole(newRole);
      handleClose();
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    try {
      await updateRole(editingRole.id, editingRole);
      handleClose();
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    setDeletingRoleId(id);
    setIsSubmitting(true);
    try {
      await deleteRole(id);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
      setDeletingRoleId(null);
    }
  };

  useEffect(() => {
      fetchRoles();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles['error-message']}>Error: {error}</div>;
  }

  return (
    <div className={styles['page-container']}>
      <h1 className={styles['page-title']}>Roles</h1>
      <div className={styles['form-container']}>
        <button
          className={styles.button}
          onClick={() => {
            setNewRole({ name: '', description: '', is_Active: true });
            handleClickOpen();
          }}
        >
          <AddIcon />
          Add Role
        </button>
      </div>
      <div className={styles['table-container']}>
        <table className={styles.table}>
          <thead className={styles.head}>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th className={styles['roles-table-actions']}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td>{role.is_active ? 'Active' : 'Inactive'}</td>
                <td className={styles['roles-table-actions']}>
                  <button className={styles.button} onClick={() => {
                    setEditingRole(role);
                    handleClickOpen();
                  }}><EditIcon />Edit</button>
                  <button className={styles.button} onClick={() => handleDelete(role.id)} disabled={isSubmitting && deletingRoleId === role.id}>
                    {isSubmitting && deletingRoleId === role.id ? 'Deleting...' : <><DeleteIcon />Delete</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className={styles['modal-overlay']}>
          <div className={styles.modal}>
            <h3 className={styles['modal-title']}>{newRole ? 'Add Role' : 'Edit Role'}</h3>
            <div className={styles['modal-content']}>
              <input
                autoFocus
                className={styles['form-input']}
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
                className={styles['form-input']}
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
                className={styles['form-select']}
                value={newRole ? newRole.is_Active : editingRole?.is_Active}
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
            <div className={styles['modal-actions']}>
              <button className={styles.button} onClick={handleClose} disabled={isSubmitting}>Cancel</button>
              <button className={styles.button} onClick={newRole ? handleSaveNew : handleSaveEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (newRole ? 'Add' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}