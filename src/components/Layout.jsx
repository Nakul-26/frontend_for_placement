import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const adminMenuItems = [
  { text: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
  { text: 'Users', path: '/admin/users', icon: '👥' },
  { text: 'Roles', path: '/admin/roles', icon: '🔒' },
  { text: 'Permissions', path: '/admin/permissions', icon: '🔑' },
  { text: 'Role-Permission', path: '/admin/role-permission', icon: '🔗' },
  { text: 'Manage Jobs', path: '/admin/manage-jobs', icon: '💼' },
  { text: 'Notifications', path: '/notifications', icon: '🔔' },
  { text: 'Chat', path: '/chat', icon: '💬' },
];

const facultyMenuItems = [
  { text: 'Dashboard', path: '/faculty/dashboard', icon: '🏠' },
  { text: 'Analytics', path: '/faculty/analytics', icon: '📊' },
  { text: 'Notifications', path: '/notifications', icon: '🔔' },
  { text: 'Chat', path: '/chat', icon: '💬' },
];

const studentMenuItems = [
  { text: 'Dashboard', path: '/student/dashboard', icon: '🏠' },
  { text: 'Skill Development', path: '/student/skill-development', icon: '📚' },
  { text: 'Assessments', path: '/student/assessments', icon: '📝' },
  { text: 'My Profile', path: '/student/profile', icon: '🧑‍🎓' },
  { text: 'Notifications', path: '/notifications', icon: '🔔' },
  { text: 'Chat', path: '/chat', icon: '💬' },
];

const getMenuItems = (role) => {
  switch (role) {
    case 'admin':
      return adminMenuItems;
    case 'faculty':
      return facultyMenuItems;
    case 'student':
      return studentMenuItems;
    default:
      return [];
  }
};

export default function Layout({ children }) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = getMenuItems(user?.role);

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
                className={({ isActive }) =>
                  "sidebar-link" + (isActive ? " active" : "")
                }
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
