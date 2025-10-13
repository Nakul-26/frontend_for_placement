import { useState, useEffect, useCallback } from "react";
import { api, NotificationsApi } from "../services/api";
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = api;

  // Expose loadUser so any component can restore user state from /api/me
  const loadUser = useCallback(async () => {
    try {
      setError(null);
      const storedAdminUser = localStorage.getItem('AdminUser');
      if (storedAdminUser) {
        setUser(JSON.parse(storedAdminUser));
        return JSON.parse(storedAdminUser);
      }

      const res = await axios.get('/api/me', { withCredentials: true });
      let newUser = res.data?.data?.user ?? res.data?.user ?? res.data;
      if (newUser && newUser.role_id) {
        if (newUser.role_id === 1) newUser.role = 'admin';
        else if (newUser.role_id === 2) newUser.role = 'faculty';
        else if (newUser.role_id === 3) newUser.role = 'student';
      }
      setUser(newUser ?? null);
      return newUser;
    } catch (error) {
      setUser(null);
      console.debug('Not logged in:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initialAuthCheck = async () => {
      const storedDummyUser = localStorage.getItem('dummyUser');

      if (storedDummyUser) {
        setUser(JSON.parse(storedDummyUser));
        setLoading(false);
        return;
      }

      await loadUser();
      setLoading(false);
    };
    initialAuthCheck();
  }, [loadUser]);

  const login = useCallback(async (email, password, role) => {
    setError(null);

    // Dummy login credentials for testing
    if (email === 'testadmin@test.com' && password === 'testpassword' && role === 'admin') {
      const dummyUser = { id: '1', email: 'testadmin@test.com', role: 'admin', name: 'Test Admin' };
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setUser(dummyUser);
      toast.success('Dummy Admin Login successful!');
      return { success: true, data: { user: dummyUser } };
    }
    if (email === 'testfaculty@test.com' && password === 'testpassword' && role === 'faculty') {
      const dummyUser = { id: '2', email: 'testfaculty@test.com', role: 'faculty', name: 'Test Faculty' };
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setUser(dummyUser);
      toast.success('Dummy Faculty Login successful!');
      return { success: true, data: { user: dummyUser } };
    }
    if (email === 'teststudent@test.com' && password === 'testpassword' && role === 'student') {
      const dummyUser = { id: '3', email: 'teststudent@test.com', role: 'student', name: 'Test Student' };
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setUser(dummyUser);
      toast.success('Dummy Student Login successful!');
      return { success: true, data: { user: dummyUser } };
    }
    if (email === 'testmanager@test.com' && password === 'testpassword' && role === 'manager') {
      const dummyUser = { id: '4', email: 'testmanager@test.com', role: 'manager', name: 'Test Manager' };
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setUser(dummyUser);
      toast.success('Dummy Manager Login successful!');
      return { success: true, data: { user: dummyUser } };
    }

    try {
      const res = await axios.post(
        "/api/login",
        { email, password, role },
        { withCredentials: true }
      );
      // Expect user at res.data.data.user
      let newUser = res.data?.data?.user ?? res.data?.user ?? res.data;
      // Map role_id to role string for frontend
      if (newUser && newUser.role_id) {
        if (newUser.role_id === 1) newUser.role = 'admin';
        else if (newUser.role_id === 2) newUser.role = 'faculty';
        else if (newUser.role_id === 3) newUser.role = 'student';
      }
      localStorage.setItem('AdminUser', JSON.stringify(newUser));
      setUser(newUser);
      console.debug('AuthProvider: setUser after login', newUser);
      toast.success('Login successful!');
      return { success: true, data: { user: newUser } };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, error: err };
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await axios.get('/api/refresh', { withCredentials: true });
      let newUser = res.data?.data?.user ?? res.data?.user ?? res.data;
      if (newUser && newUser.role_id) {
        if (newUser.role_id === 1) newUser.role = 'admin';
        else if (newUser.role_id === 2) newUser.role = 'faculty';
        else if (newUser.role_id === 3) newUser.role = 'student';
      }
      setUser(newUser ?? null);
      console.debug('AuthProvider: setUser after refresh', newUser);
      return { success: true, user: newUser ?? null };
    } catch (err) {
      setUser(null);
      return { success: false, error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    localStorage.removeItem('dummyUser');
    try {
      await axios.get("/api/logout", { withCredentials: true });
      setUser(null);
      // tokens are httpOnly; backend clears them via /api/logout
      toast.success('Logged out successfully!');
      console.debug('AuthProvider: setUser after logout', null);
      localStorage.removeItem('AdminUser');
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed");
      toast.error('Logout failed. Please try again.');
      return { success: false, error: err };
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    refresh,
    logout,
    loadUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};