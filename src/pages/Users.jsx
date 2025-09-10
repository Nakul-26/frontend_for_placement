import React from "react";
import Sidebar from "../components/Sidebar";

const TABS = [
  { label: "Users", key: "users" },
  { label: "Roles", key: "roles" },
  { label: "Permissions", key: "permissions" },
  { label: "Role-Permission Assignments", key: "role-permissions" },
];

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("users");

  // Fetch users via GraphQL
  const fetchUsers = async () => {
    const query = `
      query {
        users {
          id
          name
          email
          created_at
          role {
            name
            description
          }
        }
      }
    `;

    try {
      setLoading(true);
      const response = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send session cookie
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      setUsers(Array.isArray(result.data?.users) ? result.data.users : []);
      setError("");
    } catch (err) {
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  // 🗑️ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  // ✏️ Edit user
  const handleEdit = (id) => {
    // redirect to a user edit page
    window.location.href = `/admin/users/${id}/edit`;
  };

  const filteredUsers = users.filter((u) =>
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="shield">
              🛡️
            </span>{" "}
            Access Control
          </h2>
          <div className="muted" style={{ marginTop: 4 }}>
            Manage roles, permissions, and access control for the system.
          </div>
        </div>

        {/* Tabs */}
        <div
          className="tabs"
          style={{
            marginTop: 24,
            marginBottom: 16,
            display: "flex",
            gap: 24,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={"tab-btn" + (activeTab === tab.key ? " active" : "")}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                padding: "8px 0",
                fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #2563eb"
                    : "2px solid transparent",
                color: activeTab === tab.key ? "#2563eb" : "#374151",
                fontSize: 15,
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              placeholder="Search by email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 36px 10px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 15,
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#2563eb",
                fontSize: 18,
                cursor: "pointer",
              }}
              title="Search by email"
            >
              📧
            </span>
          </div>
          <button
            onClick={() => setSearch("")}
            style={{
              padding: "10px 18px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f9fafb",
              color: "#374151",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Users Table */}
        <section className="card" style={{ padding: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px 0 24px",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span role="img" aria-label="users">
                👥
              </span>{" "}
              Users Management ({filteredUsers.length})
            </div>
            <button
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                fontSize: 15,
              }}
              onClick={() => (window.location.href = "/admin/users/new")}
            >
              <span role="img" aria-label="add">
                ⚙️
              </span>{" "}
              Add User
            </button>
          </div>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>
                    ID
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>
                    Name
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>
                    Email
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>
                    Role
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>
                    Status
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>
                    Created
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#dc2626" }}>
                      {error}
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                      <td style={{ padding: "10px 12px", color: "#64748b" }}>#{i + 1}</td>
                      <td style={{ padding: "10px 12px" }}>{u.name || "-"}</td>
                      <td style={{ padding: "10px 12px" }}>{u.email || "-"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            background: "#eef2ff",
                            color: "#2563eb",
                            padding: "2px 10px",
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: u.role?.description ? "help" : "default",
                          }}
                          title={u.role?.description || ""}
                        >
                          {u.role?.name || "User"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            background: "#ecfdf5",
                            color: "#16a34a",
                            padding: "2px 10px",
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          Active
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{ cursor: "pointer", color: "#2563eb", marginRight: 10 }}
                          title="Edit"
                          onClick={() => handleEdit(u.id)}
                        >
                          ✏️
                        </span>
                        <span
                          style={{ cursor: "pointer", color: "#dc2626" }}
                          title="Delete"
                          onClick={() => handleDelete(u.id)}
                        >
                          🗑️
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
