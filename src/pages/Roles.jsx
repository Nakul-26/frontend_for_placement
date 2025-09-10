import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/roles", {
        method: "GET",
        credentials: "include", // send cookies/session
      });

      if (!res.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await res.json();
      setRoles(data.roles || []); // backend should return { roles: [...] }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a role
  const handleDelete = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      const res = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete role");
      }

      // Refresh role list
      fetchRoles();
    } catch (err) {
      alert(err.message);
    }
  };

  // Navigate to Edit page
  const handleEdit = (roleId) => {
    window.location.href = `/admin/roles/${roleId}/edit`;
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h2>Role Management</h2></div>
        <section className="card" style={{padding:0}}>
          <div style={{overflowX:'auto',marginTop:0}}>
            {loading ? (
              <div style={{padding:24}}>Loading roles...</div>
            ) : error ? (
              <div style={{padding:24, color:'red'}}>Error: {error}</div>
            ) : (
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:15}}>
                <thead>
                  <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
                    <th style={{padding:'10px 12px',textAlign:'left',fontWeight:600}}>ID</th>
                    <th style={{padding:'10px 12px',textAlign:'left',fontWeight:600}}>Name</th>
                    <th style={{padding:'10px 12px',textAlign:'left',fontWeight:600}}>Description</th>
                    <th style={{padding:'10px 12px',textAlign:'left',fontWeight:600}}>Active</th>
                    <th style={{padding:'10px 12px',textAlign:'left',fontWeight:600}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <tr key={role.id} style={{borderBottom:'1px solid #f1f1f1'}}>
                        <td style={{padding:'10px 12px'}}>{role.id}</td>
                        <td style={{padding:'10px 12px'}}>{role.name}</td>
                        <td style={{padding:'10px 12px'}}>{role.description}</td>
                        <td style={{padding:'10px 12px'}}>{role.is_active ? "Yes" : "No"}</td>
                        <td style={{padding:'10px 12px'}}>
                          <button onClick={() => handleEdit(role.id)} style={{marginRight:8,background:'#2563eb',color:'#fff',border:'none',borderRadius:6,padding:'4px 12px',cursor:'pointer'}}>Edit</button>
                          <button onClick={() => handleDelete(role.id)} style={{color:'#dc2626',background:'#fff1f2',border:'1px solid #dc2626',borderRadius:6,padding:'4px 12px',cursor:'pointer'}}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{textAlign:'center',padding:24}}>No roles found</td>
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
