import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import './RolePermissions.css';

export default function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [originalRolePermissions, setOriginalRolePermissions] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [rolePermissionsLoading, setRolePermissionsLoading] = useState(false);
  const [rolePermissionsError, setRolePermissionsError] = useState(null);

  useEffect(() => {
    const changesDetected =
      rolePermissions.length !== originalRolePermissions.length ||
      ![...rolePermissions].sort().every((value, index) => value === [...originalRolePermissions].sort()[index]);
    setHasChanges(changesDetected);
  }, [rolePermissions, originalRolePermissions]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rolesRes, permissionsRes] = await Promise.all([
        api.get('/rbac/roles', { withCredentials: true }),
        api.get('/rbac/permissions', { withCredentials: true }),
      ]);
      setRoles(rolesRes.data.data || []);
      setPermissions(permissionsRes.data.data || []);
      toast.success('Roles and permissions loaded successfully!');
    } catch (err) {
      const errorMessage = err.message || 'Failed to load initial data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = useCallback(async () => {
    if (!selectedRole) return;
    try {
      setRolePermissionsLoading(true);
      setRolePermissionsError(null);
      const res = await api.get(
        `/rbac/role-permissions/${selectedRole.id}`,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      const currentPermissions = res.data.data.map(rp => rp.permission_id) || [];
      setRolePermissions(currentPermissions);
      setOriginalRolePermissions(currentPermissions);
    } catch (err) {
      const errorMessage = err.message || `Failed to fetch permissions for ${selectedRole.name}`;
      setRolePermissionsError(errorMessage);
      toast.error(errorMessage);
      setRolePermissions([]);
      setOriginalRolePermissions([]);
    } finally {
      setRolePermissionsLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions();
    }
  }, [selectedRole, fetchRolePermissions]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const togglePermission = (permId) => {
    setRolePermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;

    let originalPermissionsForSave = [];
    try {
      const res = await api.get(
        `/rbac/role-permissions/${selectedRole.id}`,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      originalPermissionsForSave = res.data.data.map(rp => rp.permission_id) || [];

    } catch (err) {
      console.error('Failed to fetch original permissions for comparison:', err);
      toast.error('Failed to save changes: could not retrieve current permissions.');
      return;
    }

    const addedPermissions = rolePermissions.filter(
      (p) => !originalPermissionsForSave.includes(p)
    );
    const removedPermissions = originalPermissionsForSave.filter(
      (p) => !rolePermissions.includes(p)
    );

    if (addedPermissions.length === 0 && removedPermissions.length === 0) {
      toast.info('No changes detected.');
      setIsSubmitting(false);
      return;
    }
    setHasChanges(true);

    setIsSubmitting(true);

    try {
      const addRequests = addedPermissions.map((permId) =>
        api.post(
          `/rbac/role-permissions`,
          { role_id: selectedRole.id, permission_id: permId },
          { withCredentials: true }
        )
      );

      const removeRequests = removedPermissions.map((permId) =>
        api.delete(`/rbac/role-permissions`, {
          data: { role_id: selectedRole.id, permission_id: permId },
          withCredentials: true,
        })
      );

      await Promise.all([...addRequests, ...removeRequests]);

      toast.success('Permissions updated successfully!');
      await fetchRolePermissions(); 

    } catch (err) {
      console.error('Failed to update permissions:', err);
      toast.error(err.response?.data?.message || 'Failed to update permissions');
    } finally {
      originalPermissionsForSave = [...rolePermissions];
      setIsSubmitting(false);
      setHasChanges(false);
      setOriginalRolePermissions([...rolePermissions]);}
  };

  if (loading) {
    return <div className="loading">Loading initial data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Role Permissions</h1>
      <div className="card">
        <div className="role-permissions-grid">
          <div className="roles-list-container">
            <h2 className="sub-title">Roles</h2>
            <ul className="roles-list">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className={`role-item ${selectedRole?.id === role.id ? 'selected' : ''}`}
                  onClick={() => handleSelectRole(role)}
                >
                  {role.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="permissions-list-container">
            {selectedRole ? (
              <div>
                <h2 className="sub-title">Permissions for {selectedRole.name}</h2>
                {rolePermissionsLoading ? (
                  <p className="placeholder-text">Loading permissions...</p>
                ) : rolePermissionsError ? (
                  <div className="error-message">{rolePermissionsError}</div>
                ) : (
                  <ul className="permissions-list">
                    {permissions.map((perm) => (
                      <li key={perm.id} className="permission-item" onClick={() => togglePermission(perm.id)}>
                        <input
                          type="checkbox"
                          checked={rolePermissions.includes(perm.id)}
                          readOnly
                        />
                        <span>{perm.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {hasChanges && (
                  <div className="action-buttons">
                    <button className="button" onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <button className="button secondary" onClick={fetchRolePermissions}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="placeholder-text">Select a role to manage its permissions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}