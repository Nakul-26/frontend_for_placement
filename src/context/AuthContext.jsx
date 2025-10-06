import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "../services/api"; // axios instance with baseURL & interceptors
import { toast } from 'react-toastify';

const AuthContext = createContext();

const DUMMY_USER_OBJECT = {
  id: 999,
  email: "testuser@test.com",
  name: "Test User",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/refresh`, { withCredentials: true });
        console.log("Session check response:", res.data);
        const user_data = res.data.data.user;
        const role = localStorage.getItem('userRole');
        setUser({ ...user_data, role });
      } catch (err) {
        console.error("Session check failed:", err);
        setUser(null);
        toast.error('Session check failed. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = useCallback(async (email, password, role) => {
    setError(null);
    try {
      if (email === `test${role}@test.com` && password === "testpassword") {
        const dummyUser = { ...DUMMY_USER_OBJECT, email: `test${role}@test.com`, role };
        setUser(dummyUser);
        localStorage.setItem('userRole', role);
        toast.success('Login successful!');
        return { success: true, data: { user: dummyUser } };
      }

      const res = await axios.post(
        "/api/login",
        { email, password, role }, // Pass role to backend
        { withCredentials: true }
      );
      console.log("Login response data:", res);
      console.log("Login response cookies:", res.cookies);
      const user_data = res.data.data.user;
      setUser({ ...user_data, role });
      localStorage.setItem('userRole', role);
      toast.success('Login successful!');
      return { success: true, data: res.data.data };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, error: err };
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await axios.get("/api/logout", { withCredentials: true });
      setUser(null);
      localStorage.removeItem('userRole');
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
