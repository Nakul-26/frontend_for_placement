import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <div className="brand">
          <h1>ERP System</h1>
        </div>

        <div className="nav-actions">
          {user ? (
            <button className="btn small" onClick={logout}>Logout</button>
          ) : (
            <div className="nav-placeholder" />
          )}
        </div>

        
      </div>
    </header>
  );
}
