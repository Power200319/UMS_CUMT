import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import { LecturerLayout } from "./layouts/LecturerLayout";
import { StudentLayout } from "./layouts/StudentLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import RolePermission from "./pages/admin/RolePermission";
import Department from "./pages/admin/Department";
import Major from "./pages/admin/Major";
import Class from "./pages/admin/Class";
import Course from "./pages/admin/Course";
import Schedule from "./pages/admin/Schedule";
import AttendanceReport from "./pages/admin/AttendanceReport";
import Notification from "./pages/admin/Notification";
import Settings from "./pages/admin/Settings";
import StaffDashboard from "./pages/staff/Dashboard";
import RegisterStep1 from "./pages/staff/RegisterStep1";
import RegisterStep2 from "./pages/staff/RegisterStep2";
import RegisterStep3 from "./pages/staff/RegisterStep3";
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
import ReportTeaching from "./pages/lecturer/ReportTeaching";
import Score from "./pages/lecturer/Score";
import Information from "./pages/lecturer/Information";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentSchedule from "./pages/student/Schedule";
import StudentAttendance from "./pages/student/Attendance";
import StudentResult from "./pages/student/Result";
import StudentAnnouncement from "./pages/student/Announcement";
import StudentFeedback from "./pages/student/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="roles" element={<RolePermission />} />
                  <Route path="departments" element={<Department />} />
                  <Route path="majors" element={<Major />} />
                  <Route path="classes" element={<Class />} />
                  <Route path="courses" element={<Course />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="attendance" element={<AttendanceReport />} />
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
                  <Route index element={<StudentDashboard />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="schedule" element={<StudentSchedule />} />
                  <Route path="attendance" element={<StudentAttendance />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
