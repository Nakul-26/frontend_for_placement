import { useAuth } from "../context/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    console.log('User not authenticated, redirecting to login.');
    // If a single role is required, redirect to the role-specific login page
    const loginPath = roles && roles.length === 1 ? `/login/${roles[0]}` : '/login';
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    console.log(`User role '${user.role}' not authorized for this route.`);
    // perform a case-insensitive role check
    const userRole = (user.role || '').toString().toLowerCase();
    const allowed = roles.map(r => r.toString().toLowerCase());
    if (!allowed.includes(userRole)) {
      console.log(`User role '${user.role}' not authorized for this route.`);
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
};