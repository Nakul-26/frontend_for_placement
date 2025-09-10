import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>Welcome to ERP Dashboard</h2>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Role ID: {user.role_id}</p>
        </div>

        <section className="cards">
          <div className="card">Quick metrics and widgets will appear here.</div>
        </section>
      </main>
    </div>
  );
}
