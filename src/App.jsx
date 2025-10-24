import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
// import StudentLogin from './pages/StudentLogin.jsx';
// import FacultyLogin from './pages/FacultyLogin.jsx';
// import AdminLogin from './pages/AdminLogin.jsx';
import Landing from './pages/Landing.jsx';
// import Register from './pages/Register.jsx';
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
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import CompanyDashboard from './pages/CompanyDashboard.jsx'; // Import Company Dashboard

// Company Pages
import CompanyJobOfferings from './pages/CompanyJobOfferings.jsx';

// Admin Pages
import Users from './pages/Users.jsx';
import Roles from './pages/Roles.jsx';
import Permissions from './pages/Permissions.jsx';
import RolePermissions from './pages/RolePermissions.jsx';
import AdminNotifications from './pages/AdminNotifications.jsx'; // New import
import Notifications from './components/Notifications.jsx'; // Add this import

// Shared Pages
import ManageJobOfferings from './pages/ManageJobOfferings.jsx';
// import ManageNotifications from './pages/ManageNotifications.jsx'; // Removed import
import SkillDevelopment from './pages/SkillDevelopment.jsx';
import Assessments from './pages/Assessments.jsx';
import Chat from './pages/Chat.jsx';
import Analytics from './pages/Analytics.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
// import NotificationsPage from './pages/NotificationsPage.jsx';

// Faculty Pages
import StudentList from './pages/StudentList.jsx';
import JobPostingApproval from './pages/JobPostingApproval.jsx';
import Announcements from './pages/Announcements.jsx';
import StudentEligibility from './pages/StudentEligibility.jsx';
import ManagePlacementDrive from './pages/ManagePlacementDrive.jsx';
import FacultyJobOfferings from './pages/FacultyJobOfferings.jsx'; // Add this import

// Student Pages
import JobSearch from './pages/JobSearch.jsx';
import MyApplications from './pages/MyApplications.jsx';
import RecommendedJobs from './pages/RecommendedJobs.jsx';
import QuizAttemptPage from './pages/QuizAttemptPage.jsx';
import ScoreHistory from './pages/ScoreHistory.jsx';
import SkillRoadmaps from './pages/SkillRoadmaps.jsx';
import MySavedContent from './pages/MySavedContent.jsx';
import StudentProfileEdit from './pages/StudentProfileEdit.jsx'; // Import the new component
import SkillRoadmapRedirect from './pages/SkillRoadmapRedirect.jsx'; // Import the new component

import StudentApplications from "./pages/StudentApplications";
import ManageCompanies from "./pages/ManageCompanies";
import AdminStudentRegistration from "./pages/AdminStudentRegistration.jsx";

import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            {/* <Route path="/jobs" element={<PublicJobListing />} /> */}
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/skill-development-public" element={<SkillDevelopment />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/login/student" element={<StudentLogin />} /> */}
            {/* <Route path="/login/faculty" element={<FacultyLogin />} /> */}
            {/* <Route path="/login/admin" element={<AdminLogin />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}

            {/* Admin Routes */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
              <Route path="/admin/users" element={<Layout><Users /></Layout>} />
              <Route path="/admin/roles" element={<Layout><Roles /></Layout>} />
              <Route path="/admin/permissions" element={<Layout><Permissions /></Layout>} />
              <Route path="/admin/role-permission" element={<Layout><RolePermissions /></Layout>} />
              <Route path="/admin/jobs" element={<Layout><ManageJobOfferings /></Layout>} />
              <Route path="/admin/notifications" element={<Layout><AdminNotifications /></Layout>} />
              <Route path="/admin/student-applications" element={<Layout><StudentApplications /></Layout>} />
              <Route path="/admin/companies" element={<Layout><ManageCompanies /></Layout>} />
              <Route path="/admin/student-registration" element={<Layout><AdminStudentRegistration /></Layout>} />
            </Route>

            {/* Manager Routes */}
            <Route element={<ProtectedRoute roles={['manager']} />}>
              <Route path="/manager/dashboard" element={<Layout><ManagerDashboard /></Layout>} />
              <Route path="/manager/notifications" element={<Layout><AdminNotifications /></Layout>} />
              <Route path="/manager/job-offerings" element={<Layout><ManageJobOfferings /></Layout>} />
            </Route>

            {/* Company Routes */}
            <Route element={<ProtectedRoute roles={['company']} />}>
              <Route path="/company/dashboard" element={<Layout><CompanyDashboard /></Layout>} />
              <Route path="/company/jobs" element={<Layout><CompanyJobOfferings /></Layout>} />
              <Route path="/company/profile" element={<Layout><CompanyProfile /></Layout>} />
            </Route>

            {/* Faculty Routes */}
            <Route element={<ProtectedRoute roles={['faculty']} />}>
              <Route path="/faculty/dashboard" element={<Layout><FacultyDashboard /></Layout>} />
              {/* <Route path="/faculty/analytics" element={<Layout><Analytics /></Layout>} /> */}
              <Route path="/faculty/notifications" element={<Layout><Notifications /></Layout>} />
              {/* <Route path="/faculty/student-list" element={<Layout><StudentList /></Layout>} /> */}
              {/* <Route path="/faculty/job-posting-approval" element={<Layout><JobPostingApproval /></Layout>} /> */}
              {/* <Route path="/faculty/announcements" element={<Layout><Announcements /></Layout>} /> */}
              {/* <Route path="/faculty/student-eligibility" element={<Layout><StudentEligibility /></Layout>} /> */}
              {/* <Route path="/faculty/manage-placement-drive" element={<Layout><ManagePlacementDrive /></Layout>} /> */}
              {/* <Route path="/faculty/manage-jobs" element={<Layout><ManageJobOfferings /></Layout>} /> */}
              <Route path="/faculty/jobs" element={<Layout><FacultyJobOfferings /></Layout>} /> {/* New route for faculty job offerings */}
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute roles={['student']} />}>
              <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
              <Route path="/student/profile/edit" element={<Layout><StudentProfileEdit /></Layout>} />
              <Route path="/student/roadmap" element={<Layout><SkillRoadmapRedirect /></Layout>} />
              {/* <Route path="/student/skill-development" element={<Layout><SkillDevelopment /></Layout>} /> */}
              {/* <Route path="/student/assessments" element={<Layout><Assessments /></Layout>} /> */}
              {/* <Route path="/student/profile" element={<Layout><StudentProfile /></Layout>} /> */}
              <Route path="/student/notifications" element={<Layout><Notifications /></Layout>} />
              {/* <Route path="/student/job-search" element={<Layout><JobSearch /></Layout>} /> */}
              {/* <Route path="/student/my-applications" element={<Layout><MyApplications /></Layout>} /> */}
              <Route path="/student/jobs" element={<Layout><RecommendedJobs /></Layout>} />
              {/* <Route path="/student/quiz-attempt" element={<Layout><QuizAttemptPage /></Layout>} /> */}
              {/* <Route path="/student/score-history" element={<Layout><ScoreHistory /></Layout>} /> */}
              {/* <Route path="/student/skill-roadmaps" element={<Layout><SkillRoadmaps /></Layout>} /> */}
              {/* <Route path="/student/my-saved-content" element={<Layout><MySavedContent /></Layout>} /> */}
              {/* <Route path="/student/manage-notifications" element={<Layout><AdminNotifications /></Layout>} /> */}
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