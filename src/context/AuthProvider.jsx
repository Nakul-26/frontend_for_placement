import { useState, useEffect, useCallback } from "react";
import axios from "../services/api"; // axios instance with baseURL & interceptors
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const initialAuthCheck = async () => {
      const storedDummyUser = localStorage.getItem('dummyUser');
      const storedDummyAccessToken = localStorage.getItem('dummyAccessToken');

      if (storedDummyUser && storedDummyAccessToken) {
        setUser(JSON.parse(storedDummyUser));
        setAccessToken(storedDummyAccessToken);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/refresh', { withCredentials: true });
        const { accessToken: newAccessToken, user: newUser } = res.data;
        setAccessToken(newAccessToken);
        setUser(newUser);
      } catch (error) {
        // User is not logged in or refresh failed
        setUser(null);
        setAccessToken(null);
      }
      setLoading(false);
    };

    initialAuthCheck();
  }, []);

  const login = useCallback(async (email, password, role) => {
    setError(null);

    // Dummy login credentials for testing
    if (email === 'testadmin@test.com' && password === 'testpassword' && role === 'admin') {
      const dummyUser = { id: '1', email: 'testadmin@test.com', role: 'admin', name: 'Test Admin' };
      const dummyAccessToken = 'dummy-admin-token';
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      localStorage.setItem('dummyAccessToken', dummyAccessToken);
      setAccessToken(dummyAccessToken);
      setUser(dummyUser);
      toast.success('Dummy Admin Login successful!');
      return { success: true, data: { accessToken: dummyAccessToken, user: dummyUser } };
    }
    if (email === 'testfaculty@test.com' && password === 'testpassword' && role === 'faculty') {
      const dummyUser = { id: '2', email: 'testfaculty@test.com', role: 'faculty', name: 'Test Faculty' };
      const dummyAccessToken = 'dummy-faculty-token';
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      localStorage.setItem('dummyAccessToken', dummyAccessToken);
      setAccessToken(dummyAccessToken);
      setUser(dummyUser);
      toast.success('Dummy Faculty Login successful!');
      return { success: true, data: { accessToken: dummyAccessToken, user: dummyUser } };
    }
    if (email === 'teststudent@test.com' && password === 'testpassword' && role === 'student') {
      const dummyUser = { id: '3', email: 'teststudent@test.com', role: 'student', name: 'Test Student' };
      const dummyAccessToken = 'dummy-student-token';
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      localStorage.setItem('dummyAccessToken', dummyAccessToken);
      setAccessToken(dummyAccessToken);
      setUser(dummyUser);
      toast.success('Dummy Student Login successful!');
      return { success: true, data: { accessToken: dummyAccessToken, user: dummyUser } };
    }

    try {
      const res = await axios.post(
        "/api/login",
        { email, password, role }, // Pass role to backend
        { withCredentials: true }
      );
      const { accessToken: newAccessToken, user: newUser } = res.data;
      setAccessToken(newAccessToken);
      setUser(newUser);
      toast.success('Login successful!');
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    localStorage.removeItem('dummyUser');
    localStorage.removeItem('dummyAccessToken');
    try {
      await axios.get("/api/logout", { withCredentials: true });
      setUser(null);
      setAccessToken(null);
      toast.success('Logged out successfully!');
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
    logout,
    isAuthenticated: !!user,
    accessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};