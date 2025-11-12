import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import { AdminLayout } from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import { LecturerLayout } from "./layouts/LecturerLayout";
import { StudentLayout } from "./layouts/StudentLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserManagementAdmin from "./pages/admin/UserManagementAdmin";
import RolePermission from "./pages/admin/RolePermission";
import Department from "./pages/admin/Department";
import Major from "./pages/admin/Major";
import Class from "./pages/admin/Class";
import Course from "./pages/admin/Course";
import Schedule from "./pages/admin/Schedule";
import AttendanceReport from "./pages/admin/AttendanceReport";
import TeacherApplications from "./pages/admin/TeacherApplications";
import TeacherApplicationDetail from "./pages/admin/TeacherApplicationDetail";
import TeacherContractForm from "./pages/admin/TeacherContractForm";
import TeacherScheduleForm from "./pages/admin/TeacherScheduleForm";
import TeacherAttendanceReport from "./pages/admin/TeacherAttendanceReport";
import AdminSystemSettings from "./pages/admin/AdminSystemSettings";
import Notification from "./pages/admin/Notification";
import Settings from "./pages/admin/Settings";
import StaffDashboard from "./pages/staff/StaffDashboard";
import RegisterStep1 from "./pages/staff/RegisterStep1";
import RegisterStep2 from "./pages/staff/RegisterStep2";
import RegisterStep3 from "./pages/staff/RegisterStep3";
import TeacherRegistration from "./pages/staff/TeacherRegistration";
import StudentRegistration from "./pages/staff/StudentRegistration";
import TeacherApplicationsStaff from "./pages/staff/TeacherApplicationsStaff";
import StudentManagement from "./pages/staff/StudentManagement";
import ScheduleManagement from "./pages/staff/ScheduleManagement";
import AttendanceMonitor from "./pages/staff/AttendanceMonitor";
import StaffReports from "./pages/staff/StaffReports";
import StaffDepartment from "./pages/staff/StaffDepartment";
import StaffMajor from "./pages/staff/StaffMajor";
import StaffClass from "./pages/staff/StaffClass";
import StaffAttendance from "./pages/staff/StaffAttendance";
import StaffResult from "./pages/staff/StaffResult";
import StaffCertificate from "./pages/staff/StaffCertificate";
import StaffReport from "./pages/staff/StaffReport";
import StaffAnnouncement from "./pages/staff/StaffAnnouncement";
import LecturerProfile from "./pages/lecturer/Profile";
import TeacherContracts from "./pages/lecturer/TeacherContracts";
import CheckInOut from "./pages/lecturer/CheckInOut";
import QRCheckInOut from "./pages/lecturer/QRCheckInOut";
import ReportTeaching from "./pages/lecturer/ReportTeaching";
import Score from "./pages/lecturer/Score";
import Information from "./pages/lecturer/Information";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentSchedule from "./pages/student/Schedule";
import StudentAttendance from "./pages/student/Attendance";
import AttendanceDashboard from "./pages/student/AttendanceDashboard";
import QRCheckIn from "./pages/student/QRCheckIn";
import StudentResult from "./pages/student/Result";
import StudentAnnouncement from "./pages/student/Announcement";
import StudentFeedback from "./pages/student/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Role-based redirection
  const getRoleBasedRedirect = () => {
    if (!user?.roles || user.roles.length === 0) return '/admin';

    const primaryRole = user.roles[0].name.toLowerCase();
    switch (primaryRole) {
      case 'admin':
        return '/admin';
      case 'staff':
        return '/staff';
      case 'lecturer':
        return '/lecturer';
      case 'student':
        return '/student';
      default:
        return '/admin';
    }
  };

  // Auto-redirect after login
  useEffect(() => {
    if (user && !isLoading) {
      const redirectPath = getRoleBasedRedirect();
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        window.location.href = redirectPath;
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getRoleBasedRedirect()} replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin/*"
        element={
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagementAdmin />} />
              <Route path="roles" element={<RolePermission />} />
              <Route path="departments" element={<Department />} />
              <Route path="majors" element={<Major />} />
              <Route path="classes" element={<Class />} />
              <Route path="courses" element={<Course />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="attendance" element={<AttendanceReport />} />
              <Route path="teacher-applications" element={<TeacherApplications />} />
              <Route path="teacher-applications/:id" element={<TeacherApplicationDetail />} />
              <Route path="teacher-contracts/new" element={<TeacherContractForm />} />
              <Route path="teacher-schedules/new" element={<TeacherScheduleForm />} />
              <Route path="teacher-attendance" element={<TeacherAttendanceReport />} />
              <Route path="system-settings" element={<AdminSystemSettings />} />
              <Route path="notifications" element={<Notification />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminLayout>
        }
      />
      <Route
        path="/staff/*"
        element={
          <StaffLayout>
            <Routes>
              <Route index element={<StaffDashboard />} />
              <Route path="register" element={<Navigate to="/staff/register/1" replace />} />
              <Route path="register/1" element={<RegisterStep1 />} />
              <Route path="register/2" element={<RegisterStep2 />} />
              <Route path="register/3" element={<RegisterStep3 />} />
              <Route path="teacher-registration" element={<TeacherRegistration />} />
              <Route path="student-registration" element={<StudentRegistration />} />
              <Route path="teacher-applications" element={<TeacherApplicationsStaff />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="schedule-management" element={<ScheduleManagement />} />
              <Route path="attendance-monitor" element={<AttendanceMonitor />} />
              <Route path="reports" element={<StaffReports />} />
              <Route path="departments" element={<StaffDepartment />} />
              <Route path="majors" element={<StaffMajor />} />
              <Route path="classes" element={<StaffClass />} />
              <Route path="attendance" element={<StaffAttendance />} />
              <Route path="results" element={<StaffResult />} />
              <Route path="certificates" element={<StaffCertificate />} />
              <Route path="reports" element={<StaffReport />} />
              <Route path="announcements" element={<StaffAnnouncement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </StaffLayout>
        }
      />
      <Route
        path="/lecturer/*"
        element={
          <LecturerLayout>
            <Routes>
              <Route index element={<Navigate to="/lecturer/profile" replace />} />
              <Route path="profile" element={<LecturerProfile />} />
              <Route path="contracts" element={<TeacherContracts />} />
              <Route path="checkinout" element={<CheckInOut />} />
              <Route path="qr-checkin" element={<QRCheckInOut />} />
              <Route path="reports" element={<ReportTeaching />} />
              <Route path="scores" element={<Score />} />
              <Route path="information" element={<Information />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LecturerLayout>
        }
      />
      <Route
        path="/student/*"
        element={
          <StudentLayout>
            <Routes>
              <Route index element={<AttendanceDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="schedule" element={<StudentSchedule />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="checkin" element={<QRCheckIn />} />
              <Route path="result" element={<StudentResult />} />
              <Route path="announcement" element={<StudentAnnouncement />} />
              <Route path="feedback" element={<StudentFeedback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </StudentLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
