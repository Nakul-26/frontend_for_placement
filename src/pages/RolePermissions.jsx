import { useEffect, useState } from 'react';
import api from '../services/api.jsx';
import '../styles/styles.css';

export default function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);

  const fetchData = async () => {
    const query = `
      query {
        roles {
          id
          name
          permissions {
            id
            name
          }
        }
        permissions {
          id
          name
        }
      }
    `;
    try {
      setLoading(true);
      const res = await api.post(
        '/graphql',
        { query },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      const data = res.data.data;
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch roles/permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions.map((p) => p.id));
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

    const originalPermissions = selectedRole.permissions.map((p) =>
      typeof p === 'object' ? p.id : p
    );

    const addedPermissions = rolePermissions.filter(
      (p) => !originalPermissions.includes(p)
    );
    const removedPermissions = originalPermissions.filter(
      (p) => !rolePermissions.includes(p)
    );

    if (addedPermissions.length === 0 && removedPermissions.length === 0) {
      alert('No changes detected.');
      return;
    }

    setSaving(true);

    try {
      const addRequests = addedPermissions.map((permId) =>
        api.post(
          `/api/rolepermissions`,
          { roleId: selectedRole.id, permissionId: permId },
          { withCredentials: true }
        )
      );

      const removeRequests = removedPermissions.map((permId) =>
        api.delete(`/api/rolepermissions`, {
          data: { roleId: selectedRole.id, permissionId: permId },
          withCredentials: true,
        })
      );

      await Promise.all([...addRequests, ...removeRequests]);

      alert('Permissions updated successfully!');
      await fetchData();
      setSelectedRole(null);
      setRolePermissions([]);
    } catch (err) {
      console.error('Failed to update permissions:', err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Role Permissions</h1>
      <div className="table-container">
        <div className="role-permissions-grid">
          <div>
            <ul className="role-permissions-roles-list">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className={`role-permissions-role-item ${selectedRole?.id === role.id ? 'selected' : ''}`}
                  onClick={() => handleSelectRole(role)}
                >
                  {role.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            {selectedRole ? (
              <div>
                <ul className="role-permissions-permissions-list">
                  {permissions.map((perm) => (
                    <li key={perm.id} className="role-permissions-permission-item" onClick={() => togglePermission(perm.id)}>
                      <input
                        type="checkbox"
                        checked={rolePermissions.includes(perm.id)}
                        readOnly
                      />
                      <span>{perm.name}</span>
                    </li>
                  ))}
                </ul>
                <div className="role-permissions-buttons">
                  <button className="button" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="button" onClick={() => setSelectedRole(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>Select a role to manage its permissions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}