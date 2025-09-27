import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Roles from './pages/Roles.jsx';
import Permissions from './pages/Permissions.jsx';
import Register from './pages/Register.jsx';
import RolePermissions from './pages/RolePermissions.jsx';
import Layout from './components/Layout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ManageJobOfferings from './pages/ManageJobOfferings.jsx';
import ManageNotifications from './pages/ManageNotifications.jsx';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* This route uses a nested structure for the protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/users" element={<Layout><Users /></Layout>} />
              <Route path="/roles" element={<Layout><Roles /></Layout>} />
              <Route path="/permissions" element={<Layout><Permissions /></Layout>} />
              <Route path="/role-permission" element={<Layout><RolePermissions /></Layout>} />
              <Route path="/manage-jobs" element={<Layout><ManageJobOfferings /></Layout>} />
              <Route path="/manage-notifications" element={<Layout><ManageNotifications /></Layout>} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;