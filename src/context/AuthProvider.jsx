import { useState, useEffect, useCallback } from "react";
import { api, NotificationsApi, NotificationsApiSecure } from "../services/api";
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const axios = api;

  // Expose loadUser so any component can restore user state from /api/me
  const loadUser = useCallback(async () => {
    try {
      setError(null);
      const roles = ['admin', 'faculty', 'student', 'manager', 'company'];
      let storedUser = null;
      for (const role of roles) {
        const userStr = localStorage.getItem(`${role}User`);
        if (userStr) {
          storedUser = JSON.parse(userStr);
          break;
        }
      }

      if (storedUser) {
        setUser(storedUser);
        console.log('loadUser found stored user:', storedUser);
        return storedUser;
      }

      const res = await axios.get('/api/login', { withCredentials: true });
      console.log('loadUser response:', res.data);

      let newUser = res.data?.data?.user ?? res.data?.user ?? res.data;
      console.log('loadUser fetched user:', newUser);
      if (newUser && newUser.role_id) {
        if (newUser.role_id === 1) newUser.role = 'admin';
        else if (newUser.role_id === 2) newUser.role = 'faculty';
        else if (newUser.role_id === 13) newUser.role = 'student';
        else if (newUser.role_id === 15) newUser.role = 'manager';
        else if (newUser.role_id === 17) newUser.role = 'company';
      }
      console.log('loadUser processed user:', newUser);
      localStorage.setItem(`${newUser.role}User`, JSON.stringify(newUser));
      // if() {

      // }
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

  const fetchCompanyDetails = useCallback(async () => {
    try {
      const response = await NotificationsApiSecure.get(('/companyonly'), { withCredentials: true });
      setCompanyDetails(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching company details:', error);
      toast.error('Failed to load company details.');
      return null;
    }
  }, []);

  const fetchStudentDetails = useCallback(async (userId) => {
    try {
      const response = await api.get(`/rbac/student/${userId}`, { withCredentials: true });
      console.log("student details: ",response);
      setStudentDetails(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details.');
      return null;
    }
  }, []);


  const login = useCallback(async (email, password, role) => {
    setError(null);
    setLoading(true);

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
    if (email === 'testcompany@test.com' && password === 'testpassword' && role === 'company') {
      const dummyUser = { id: '5', email: 'testcompany@test.com', role: 'company', name: 'Test Company' };
      localStorage.setItem('dummyUser', JSON.stringify(dummyUser));
      setUser(dummyUser);
      toast.success('Dummy Company Login successful!');
      return { success: true, data: { user: dummyUser } };
    }

    try {
      const res = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );
      console.log('Login response2:', res);
      // Expect user at res.data.data.user
      let newUser = res.data?.data;
      console.log('Extracted user from response:', newUser);
      // Map role_id to role string for frontend
      if (newUser && newUser.role_id) {
        if (newUser.role_id === 1) newUser.role = 'admin';
        else if (newUser.role_id === 2) newUser.role = 'faculty';
        else if (newUser.role_id === 13) newUser.role = 'student';
        else if (newUser.role_id === 15) newUser.role = 'manager';
        else if (newUser.role_id === 17) newUser.role = 'company';
      }
      console.log('Mapped user:', newUser);
      localStorage.setItem(`${newUser.role}User`, JSON.stringify(newUser));
      setUser(newUser);
      console.debug('AuthProvider: setUser after login', newUser);
      toast.success('Login successful!');
      return { success: true, data: { user: newUser } };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, error: err };
    } finally {
      setLoading(false);
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

  const logout = async () => {
    setError(null);
    localStorage.removeItem('dummyUser');
    console.log('Logging out user:', user);
    localStorage.removeItem(`${user?.role}User`);
    // localStorage.removeItem('FacultyUser');
    // localStorage.removeItem('StudentUser');
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
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
  };

  const value = {
    user,
    loading,
    error,
    login,
    refresh,
    logout,
    loadUser,
    isAuthenticated: !!user,
    companyDetails,
    fetchCompanyDetails,
    studentDetails,
    fetchStudentDetails
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
