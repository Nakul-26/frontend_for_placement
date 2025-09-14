import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

export default function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);

  // Fetch roles + permissions
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
        "/graphql",
        { query },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      const data = res.data.data;
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch roles/permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Select role
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions.map((p) => p.id));
  };

  // Toggle permission selection
  const togglePermission = (permId) => {
    setRolePermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  //handle add/delete permissions
    const handleSave = async () => {
    if (!selectedRole) return;

    const originalPermissions = selectedRole.permissions.map((p) =>
        typeof p === "object" ? p.id : p
    );

    const addedPermissions = rolePermissions.filter(
        (p) => !originalPermissions.includes(p)
    );
    const removedPermissions = originalPermissions.filter(
        (p) => !rolePermissions.includes(p)
    );

    if (addedPermissions.length === 0 && removedPermissions.length === 0) {
        alert("No changes detected.");
        return;
    }

    setSaving(true); // 🔥 show loading

    try {
        // Send requests in parallel instead of one by one
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

        await Promise.all([...addRequests, ...removeRequests]); // wait for all

        alert("Permissions updated successfully!");
        await fetchData();
        setSelectedRole(null);
        setRolePermissions([]);
    } catch (err) {
        console.error("Failed to update permissions:", err);
        alert(err.response?.data?.message || err.message);
    } finally {
        setSaving(false); // 🔥 hide loading
    }
    };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>Role Permissions Management</h2>
          <p className="muted">Assign and manage permissions for each role</p>
        </div>

        <section className="card">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : (
            <div className="role-permissions">
              {/* Role List */}
              <div style={{ display: "flex", gap: "2rem" }}>
                <div style={{ flex: 1 }}>
                  <h3>Roles</h3>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {roles.map((role) => (
                      <li key={role.id} style={{ marginBottom: 8 }}>
                        <button
                          className="btn outline small"
                          style={{
                            width: "100%",
                            textAlign: "left",
                            background:
                              selectedRole?.id === role.id ? "#e0f2fe" : "#fff",
                          }}
                          onClick={() => handleSelectRole(role)}
                        >
                          {role.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Permissions for selected role */}
                <div style={{ flex: 2 }}>
                  {selectedRole ? (
                    <>
                      <h3>
                        Assign Permissions to <em>{selectedRole.name}</em>
                      </h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        {permissions.map((perm) => (
                          <label
                            key={perm.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              background: "#f9fafb",
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={rolePermissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                            />
                            {perm.name}
                          </label>
                        ))}
                      </div>

                      <div style={{ marginTop: 20 }}>
                        <button
                          className="btn primary"
                          onClick={handleSave}
                          style={{ marginRight: 8 }}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="btn secondary"
                          onClick={() => setSelectedRole(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>Select a role to manage its permissions.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
