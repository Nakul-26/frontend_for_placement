import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import './RolePermissions.css';

export default function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [originalRolePermissions, setOriginalRolePermissions] = useState([]); // To track initial permissions for comparison
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Compare rolePermissions with originalRolePermissions to determine if there are changes
    const changesDetected = 
      rolePermissions.length !== originalRolePermissions.length ||
      ![...rolePermissions].sort().every((value, index) => value === [...originalRolePermissions].sort()[index]);
    setHasChanges(changesDetected);
  }, [rolePermissions, originalRolePermissions]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      console.log('fetching roles ...');
      console.log('fetching roles ... & api: ',  api);
      setLoading(true);
      const config = {
          withCredentials: true, 
      }
      const res = await api.get('/rbac/roles', config);
      console.log('roles res: ', res.data.data);
      setRoles(res.data.data || []);
    } catch (err) {
      console.error('fetchRoles error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/rbac/role-permissions/${selectedRole.id}`,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      console.log("fetchData response:", res.data.data);
      const data = res.data.data;
      const currentPermissions = data.map(rp => rp.permission_id) || [];
      setRolePermissions(currentPermissions);
      setOriginalRolePermissions(currentPermissions); // Set original permissions here
    } catch (err) {
      console.error(err);
      setRolePermissions([]); // Clear permissions on error
      setOriginalRolePermissions([]); // Also clear original permissions
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []); 

  useEffect(() => {
    if (selectedRole) {
      fetchData();
    }
  }, [selectedRole, fetchData]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    const initialPermissions = role.permissions ? role.permissions.map((p) => p.id) : [];
    setRolePermissions(initialPermissions);
    setOriginalRolePermissions(initialPermissions); // Set original permissions on role select
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

    // Fetch the current permissions for the selected role from the backend
    // to compare against the locally modified rolePermissions
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
      // Optionally, you can also refetch roles and permissions to ensure UI is in sync

      // After saving, re-fetch the data to ensure UI is in sync with backend
      await fetchData(); 

    } catch (err) {
      console.error('Failed to update permissions:', err);
      toast.error(err.response?.data?.message || 'Failed to update permissions');
    } finally {
      originalPermissionsForSave = [...rolePermissions];
      setIsSubmitting(false);
      setHasChanges(false);
      setOriginalRolePermissions([...rolePermissions]);}
  };

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
                {loading ? (
                  <p className="placeholder-text">Loading permissions...</p>
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
                {console.log('hasChanges: ', hasChanges)}
                {hasChanges && (
                  <div className="action-buttons">
                    <button className="button" onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <button className="button secondary" onClick={() => {
                      // On cancel, revert rolePermissions to the state fetched by fetchData
                      if (selectedRole) fetchData();
                    }}>
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