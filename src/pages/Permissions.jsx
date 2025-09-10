import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/permissions")
      .then(res => {
        // Defensive: ensure array
        setPermissions(Array.isArray(res.data) ? res.data : []);
        setError("");
      })
      .catch(err => {
        setError("Failed to load permissions");
        setPermissions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h2>Permission Management</h2></div>
        <section className="card">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : (
            <ul className="list-plain">
              {permissions.map(p => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
