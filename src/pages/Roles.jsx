import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add/Edit state
  const [newRole, setNewRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/roles", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch roles");

      const data = await res.json();
      setRoles(data.roles || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Create role
  const handleSaveNew = async () => {
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newRole),
      });

      if (!res.ok) throw new Error("Failed to create role");

      setNewRole(null);
      fetchRoles();
    } catch (err) {
      alert(err.message);
    }
  };

  // ✏️ Update role
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/roles/${editingRole.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingRole),
      });

      if (!res.ok) throw new Error("Failed to update role");

      setEditingRole(null);
      fetchRoles();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🗑️ Delete role
  const handleDelete = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      const res = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete role");

      fetchRoles();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>Role Management</h2>
        </div>

        <section className="card" style={{ padding: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 16px",
            }}
          >
            <strong>Available Roles ({roles.length})</strong>
            <button
              onClick={() => setNewRole({ name: "", description: "", is_active: true })}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                cursor: "pointer",
              }}
            >
              ➕ Add Role
            </button>
          </div>

          <div style={{ overflowX: "auto", marginTop: 0 }}>
            {loading ? (
              <div style={{ padding: 24 }}>Loading roles...</div>
            ) : error ? (
              <div style={{ padding: 24, color: "red" }}>Error: {error}</div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 15,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* ➕ New Role Row */}
                  {newRole && (
                    <tr style={{ background: "#eef" }}>
                      <td>New</td>
                      <td>
                        <input
                          value={newRole.name}
                          onChange={(e) =>
                            setNewRole({ ...newRole, name: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={newRole.description}
                          onChange={(e) =>
                            setNewRole({ ...newRole, description: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={newRole.is_active ? "true" : "false"}
                          onChange={(e) =>
                            setNewRole({ ...newRole, is_active: e.target.value === "true" })
                          }
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={handleSaveNew} style={{ marginRight: 8 }}>
                          Save
                        </button>
                        <button onClick={() => setNewRole(null)}>Cancel</button>
                      </td>
                    </tr>
                  )}

                  {/* Existing Roles */}
                  {roles.length > 0 ? (
                    roles.map((role) =>
                      editingRole?.id === role.id ? (
                        <tr key={role.id} style={{ background: "#fef9c3" }}>
                          <td>{role.id}</td>
                          <td>
                            <input
                              value={editingRole.name}
                              onChange={(e) =>
                                setEditingRole({ ...editingRole, name: e.target.value })
                              }
                            />
                          </td>
                          <td>
                            <input
                              value={editingRole.description}
                              onChange={(e) =>
                                setEditingRole({
                                  ...editingRole,
                                  description: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <select
                              value={editingRole.is_active ? "true" : "false"}
                              onChange={(e) =>
                                setEditingRole({
                                  ...editingRole,
                                  is_active: e.target.value === "true",
                                })
                              }
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </td>
                          <td>
                            <button onClick={handleSaveEdit} style={{ marginRight: 8 }}>
                              Save
                            </button>
                            <button onClick={() => setEditingRole(null)}>Cancel</button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={role.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                          <td>{role.id}</td>
                          <td>{role.name}</td>
                          <td>{role.description}</td>
                          <td>{role.is_active ? "Yes" : "No"}</td>
                          <td>
                            <button
                              onClick={() => setEditingRole(role)}
                              style={{
                                marginRight: 8,
                                background: "#2563eb",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "4px 12px",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(role.id)}
                              style={{
                                color: "#dc2626",
                                background: "#fff1f2",
                                border: "1px solid #dc2626",
                                borderRadius: 6,
                                padding: "4px 12px",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: 24 }}>
                        No roles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
