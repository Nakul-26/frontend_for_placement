import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { text: 'Users', path: '/users', icon: '👥' },
  { text: 'Roles', path: '/roles', icon: '🔒' },
  { text: 'Permissions', path: '/permissions', icon: '🔑' },
  { text: 'Role-Permission', path: '/role-permission', icon: '🔗' },
  { text: 'Manage Jobs', path: '/manage-jobs', icon: '💼' },
  { text: 'Manage Notifications', path: '/manage-notifications', icon: '🔔' },
];

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Header />
      <div className="layout-container">
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h1 className="sidebar-title">Navigation</h1>
            <button className="sidebar-toggle-button" onClick={toggleSidebar}>
              {isCollapsed ? '»' : '«'}
            </button>
          </div>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.text}
                to={item.path}
                className="sidebar-link"
                activeClassName="active"
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-text">{item.text}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </>
  );
}
