import React from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
// import "./Users.css"; // new CSS file

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [searchField, setSearchField] = React.useState("email");

  const [editingUser, setEditingUser] = React.useState(null);
  const [newUser, setNewUser] = React.useState(null);

  const fetchUsers = async (searchValue = "") => {
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
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log("response to get users:",res);
      setUsers(res.data.data?.searchUsers || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
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
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      console.log("response to get all users 2 : ",res);
      setUsers(res.data.data?.users || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      const res = await api.delete(`/api/users/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete user");
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
        role_id: editingUser.role_id, // must match API expectation
      };

      const res = await api.put(`/api/users/${editingUser.id}`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.status !== 200) {
        throw new Error("Failed to update user");
      }

      setEditingUser(null);
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
        role_id: newUser.role_id, // must match API requirement
      };

      const res = await api.post(`/api/register`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // If you're using axios, res.ok does NOT exist — check res.status instead
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to create user");
      }

      setNewUser(null);
      await fetchUsers2();
    } catch (err) {
      alert(err.message);
    }
  };


  React.useEffect(() => {
    fetchUsers2();
  }, []);

  React.useEffect(() => {
    if (search === "") return;
    const timeout = setTimeout(() => fetchUsers(search), 300);
    return () => clearTimeout(timeout);
  }, [search, searchField]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>👥 Users Management</h2>
          <p className="muted">Manage users, roles, and permissions</p>
        </div>

        {/* Search Controls */}
        <div className="search-controls">
          <input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
            <option value="email">Email</option>
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
          <button className="btn outline small" onClick={() => { setSearch(""); fetchUsers2(); }}>
            Reset
          </button>
        </div>

        {/* Users Table */}
        <section className="card users-card">
          <div className="table-header">
            <strong>Users ({users.length})</strong>
            <button
              className="btn primary small"
              onClick={() =>
                setNewUser({ name: "", email: "", password: "", role_id: "" })
              }
            >
              ➕ Add User
            </button>
          </div>

          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Password</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newUser && (
                  <tr className="new-row">
                    <td>New</td>
                    <td>
                      <input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={newUser.role_id}
                        onChange={(e) =>
                          setNewUser({ ...newUser, role_id: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button className="btn primary small" onClick={handleSaveNew}>
                        Save
                      </button>
                      <button
                        className="btn outline small"
                        onClick={() => setNewUser(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}

                {loading ? (
                  <tr><td colSpan={6} className="loading">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan={6} className="error">{error}</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="no-data">No users found</td></tr>
                ) : (
                  users.map((u, i) =>
                    editingUser?.id === u.id ? (
                      <tr key={u.id} className="edit-row">
                        <td>#{i + 1}</td>
                        <td>
                          <input
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editingUser.role_id}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, role_id: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="password"
                            value={editingUser.password || ""}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, password: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <button className="btn primary small" onClick={handleSaveEdit}>
                            Save
                          </button>
                          <button
                            className="btn outline small"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={u.id}>
                        <td>{i + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role?.name}</td>
                        <td>{"********"}</td>
                        {/* <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td> */}
                        <td>
                          <div className="actions">
                            <button className="btn small" onClick={() => setEditingUser(u)}>✏️ Edit</button>
                            <button className="btn danger small" onClick={() => handleDelete(u.id)}>🗑️ Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
