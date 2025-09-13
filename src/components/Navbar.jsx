import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        {/* Brand */}
        <div className="brand">
          <Link to="/dashboard">
            <h1>Placement</h1>
          </Link>
        </div>

        {/* Menu toggle for mobile */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Navigation Actions */}
        <div className={`nav-actions ${menuOpen ? "open" : ""}`}>
          {user ? (
            <>
              {/* <span className="user-info">Hello, {user.name || "User"}</span> */}
              <button className="btn primary small" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn outline small">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
