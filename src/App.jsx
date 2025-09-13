import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import Register from "./pages/Register";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={<Dashboard />} /> {/* This route bypasses protection */}

          {/* This route uses a nested structure for the protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
            <Route path="/roles" element={<MainLayout><Roles /></MainLayout>} />
            <Route path="/permissions" element={<MainLayout><Permissions /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;