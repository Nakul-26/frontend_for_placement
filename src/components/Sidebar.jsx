import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/dashboard" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/users" className="sidebar-link">Users</Link></li>
          <li><Link to="/roles" className="sidebar-link">Roles</Link></li>
          <li><Link to="/permissions" className="sidebar-link">Permissions</Link></li>
          <li><Link to="/register" className="sidebar-link">Register</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
