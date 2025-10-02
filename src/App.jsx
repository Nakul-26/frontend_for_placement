import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import FacultyLogin from './pages/FacultyLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Landing from './pages/Landing.jsx';
import Register from './pages/Register.jsx';
import Layout from './components/Layout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import PublicJobListing from './pages/PublicJobListing.jsx';
import JobDetail from './pages/JobDetail.jsx';

// Dashboards
import AdminDashboard from './pages/AdminDashboard.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

// Admin Pages
import Users from './pages/Users.jsx';
import Roles from './pages/Roles.jsx';
import Permissions from './pages/Permissions.jsx';
import RolePermissions from './pages/RolePermissions.jsx';

// Shared Pages
import ManageJobOfferings from './pages/ManageJobOfferings.jsx';
import ManageNotifications from './pages/ManageNotifications.jsx';
import SkillDevelopment from './pages/SkillDevelopment.jsx';
import Assessments from './pages/Assessments.jsx';
import Chat from './pages/Chat.jsx';
import Analytics from './pages/Analytics.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

// import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<PublicJobListing />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/skill-development-public" element={<SkillDevelopment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/faculty" element={<FacultyLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
              <Route path="/admin/users" element={<Layout><Users /></Layout>} />
              <Route path="/admin/roles" element={<Layout><Roles /></Layout>} />
              <Route path="/admin/permissions" element={<Layout><Permissions /></Layout>} />
              <Route path="/admin/role-permission" element={<Layout><RolePermissions /></Layout>} />
              <Route path="/admin/manage-jobs" element={<Layout><ManageJobOfferings /></Layout>} />
              <Route path="/admin/manage-notifications" element={<Layout><ManageNotifications /></Layout>} />
              <Route path="/admin/notifications" element={<Layout><NotificationsPage /></Layout>} />
            </Route>

            {/* Faculty Routes */}
            <Route element={<ProtectedRoute roles={['faculty']} />}>
              <Route path="/faculty/dashboard" element={<Layout><FacultyDashboard /></Layout>} />
              <Route path="/faculty/analytics" element={<Layout><Analytics /></Layout>} />
              <Route path="/faculty/notifications" element={<Layout><NotificationsPage /></Layout>} />
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute roles={['student']} />}>
              <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
              <Route path="/student/skill-development" element={<Layout><SkillDevelopment /></Layout>} />
              <Route path="/student/assessments" element={<Layout><Assessments /></Layout>} />
              <Route path="/student/profile" element={<Layout><StudentProfile /></Layout>} />
              <Route path="/student/notifications" element={<Layout><NotificationsPage /></Layout>} />
            </Route>

            {/* Shared Routes for authenticated users */}
            <Route element={<ProtectedRoute roles={['admin', 'faculty', 'student']} />}>
                <Route path="/chat" element={<Layout><Chat /></Layout>} />
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