import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
// import "./Roles.css"; // new CSS file

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRole, setNewRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = async () => {
    const query = `
      query {
        roles {
          id
          name
          description
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
      setRoles(res.data.data.roles || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNew = async () => {
    try {
      await api.post("/api/roles", newRole, { withCredentials: true });
      setNewRole(null);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/roles/${editingRole.id}`, editingRole, {
        withCredentials: true,
      });
      setEditingRole(null);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await api.delete(`/api/roles/${id}`, { withCredentials: true });
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
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

        <section className="card roles-card">
          <div className="roles-header">
            <strong>Available Roles ({roles.length})</strong>
            <button className="btn primary" onClick={() => setNewRole({name: "", description: "", is_Active:true })}>
              ➕ Add Role
            </button>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div className="loading">Loading roles...</div>
            ) : error ? (
              <div className="error">Error: {error}</div>
            ) : (
              <table className="roles-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newRole && (
                    <tr className="row-new">
                      <td>
                        <input
                          value={newRole.name}
                          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={newRole.description}
                          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          name="is_Active"
                          value={newRole.is_Active} 
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              is_Active: e.target.value === "true",
                            })
                          }
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn success" onClick={handleSaveNew}>
                          Save
                        </button>
                        <button className="btn secondary" onClick={() => setNewRole(null)}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}

                  {roles.length > 0 ? (
                    roles.map((role) =>
                      editingRole?.name === role.name ? (
                        <tr key={role.name} className="row-edit">
                          <td>
                            <input
                              value={editingRole.name}
                              onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              value={editingRole.description}
                              onChange={(e) =>
                                setEditingRole({ ...editingRole, description: e.target.value })
                              }
                            />
                          </td>
                          <td>
                            <select
                              name="is_Active"
                              value={editingRole.is_Active} 
                              onChange={(e) =>
                                setNewRole({
                                  ...editingRole,
                                  is_Active: e.target.value === "true",
                                })
                              }
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </td>
                          <td>
                            <button className="btn success" onClick={handleSaveEdit}>
                              Save
                            </button>
                            <button className="btn secondary" onClick={() => setEditingRole(null)}>
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={role.name}>
                          <td>{role.name}</td>
                          <td>{role.description}</td>
                          <td>{role.is_Active}</td>
                          <td>
                            <button className="btn primary" onClick={() => setEditingRole(role)}>
                              Edit
                            </button>
                            <button className="btn danger" onClick={() => handleDelete(role.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-data">
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
