import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "../services/api"; // axios instance with baseURL & interceptors

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // true until we check session
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/refresh`, { withCredentials: true });
        console.log("fetch user for referesh:",res);
        setUser(res.data.data.user);
      } catch (err) {
        console.error("Session check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("Login successful, user:", res); // Log success
      console.log("after login data :", res.data.data.user )
      setUser(res.data.data.user);
      return { success: true, data: res.data.data };
    } catch (err) {
      // ----------------------------------------------------
      // CONSOLE LOGS FOR DEBUGGING THE ERROR CAUSE
      // ----------------------------------------------------
      if (err.response) {
        // The server responded with an error status code (e.g., 400, 401, 500)
        console.error("SERVER RESPONSE ERROR:");
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
        console.error("Headers:", err.response.headers);
        
        // Example: If server returns { message: "Invalid credentials" }
        setError(err.response.data?.message || "Login failed due to server error.");
        
      } else if (err.request) {
        // The request was made but no response was received.
        // This is the common sign of a CORS error or network issue.
        console.error("NETWORK ERROR (Likely CORS Issue):");
        console.error("The request was sent but no response was received.");
        console.error("This is typically due to a misconfigured backend CORS policy or the server being offline.");
        
        setError("Network Error: Could not connect to the server.");
        
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("REQUEST SETUP ERROR:");
        console.error("Message:", err.message);
        
        setError("An unexpected error occurred. Please try again.");
      }
      
      // Log the full error object for complete developer insight
      console.error("Full Axios Error Object:", err);
      // ----------------------------------------------------

      return { success: false, error: err };
    }
  }, []);

  // ✅ Logout function
  const logout = useCallback(async () => {
    setError(null);
    console.log("Logging out...");
    try {
      const res = await axios.get("/api/logout", { withCredentials: true });
      console.log("Logout response:", res.data);
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed");
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
