// API Response Types
export interface ApiResponse<T> {
  count: number;
  page: number;
  page_size: number;
  results: T[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// User & Auth Types
export type UserRoleType = "Admin" | "Staff" | "Lecturer" | "Student";
export type UserStatus = "active" | "inactive";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female";
  profile_image?: string;
  is_verified: boolean;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  last_login?: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  phone?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  gender?: "male" | "female";
  date_of_birth?: string;
}

// Role & Permission Types
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
  created_at: string;
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface UserRole {
  id: number;
  user: number;
  role: number;
  assigned_at: string;
}

// Department & Major Types
export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  head_of_department?: number;
  building_location?: string;
  contact_email?: string;
  updated_at: string;
}

export interface Major {
  id: number;
  name: string;
  code: string;
  department: number;
  description?: string;
  duration_years: number;
  is_active: boolean;
  created_at: string;
  degree_type: string;
  updated_at: string;
  department_head?: number;
}

// Class & Subject Types
export type ClassShift = "morning" | "afternoon" | "evening";

export interface Class {
  id: number;
  name: string;
  major: number;
  academic_year: string;
  semester: string;
  max_students: number;
  current_students: number;
  is_active: boolean;
  created_at: string;
  class_teacher?: number;
  room_number: string;
  shift: ClassShift;
  updated_at: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  department: number;
  credits: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  majors: number[];
  semester_offered: string;
  year_level: number;
  updated_at: string;
}

export type SemesterValue = "1" | "2";

export interface Course {
  id: number;
  code: string;
  title: string;
  description?: string;
  credits: number;
  department_id: number;
  department_code: string;
  major?: number;
  major_code?: string;
  semester: SemesterValue;
  prerequisites: Course[];
  prerequisiteIds: number[];
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

// Core Models
export interface SystemSettings {
  id: number;
  key: string;
  value: string;
  description?: string;
  category: string;
  data_type: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: number;
}

export interface AuditLog {
  id: number;
  user?: number;
  action: "create" | "update" | "delete" | "login" | "logout" | "approve" | "reject";
  model_name: string;
  object_id?: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  updated_at: string;
  content_type?: number;
  object_pk?: number;
}

export interface AcademicYear {
  id: number;
  year_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Semester {
  id: number;
  academic_year: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface Room {
  id: number;
  room_number: string;
  capacity: number;
  location?: string;
  description?: string;
}

// Lecturer Models
export interface TeacherApplication {
  id: number;
  full_name: string;
  gender: "male" | "female";
  date_of_birth: string;
  nationality: string;
  place_of_birth: string;
  degree: string;
  major_name?: string;
  institution: string;
  phone: string;
  email: string;
  experience: string;
  photo?: string;
  cv?: string;
  certificate?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  reviewed_by?: number;
  review_comment?: string;
  expected_salary?: number;
  resume_text?: string;
}

export interface TeacherProfile {
  id: number;
  user: number;
  full_name: string;
  gender: "male" | "female";
  date_of_birth: string;
  nationality: string;
  place_of_birth: string;
  degree: string;
  major_name?: string;
  institution: string;
  phone: string;
  email: string;
  experience: string;
  photo?: string;
  cv?: string;
  certificate?: string;
  created_at: string;
  department: number;
  major: number;
  is_active: boolean;
  hire_date: string;
  updated_at: string;
  address: string;
  emergency_contact: string;
  bio?: string;
}

export interface Contract {
  id: number;
  teacher: number;
  subject: number;
  department: number;
  salary: number;
  contract_start: string;
  contract_end: string;
  working_days: string[];
  conditions?: string;
  created_at: string;
  contract_type: "Full-time" | "Part-time";
  status: "Active" | "Ended" | "Pending";
  updated_at: string;
  approved_by?: number;
}

export interface Schedule {
  id: number;
  teacher: number;
  subject: number;
  class_obj: number;
  room: string;
  date: string;
  start_time: string;
  end_time: string;
  qr_code_token: string;
  is_active: boolean;
  created_at: string;
  shift: "Morning" | "Afternoon" | "Evening";
  academic_year?: number;
  semester?: number;
  updated_at: string;
  status: "Planned" | "Ongoing" | "Completed";
}

export interface QRCodeSession {
  id: number;
  schedule: number;
  token: string;
  expiration_time: string;
  status: "active" | "expired";
  created_at: string;
  activated_by?: number;
  is_used: boolean;
  updated_at: string;
}

export interface TeacherAttendance {
  id: number;
  teacher: number;
  schedule: number;
  checkin_time?: string;
  checkout_time?: string;
  duration?: string;
  status: "present" | "late" | "absent";
  created_at: string;
  remarks?: string;
  verified_by?: number;
  location?: string;
  updated_at: string;
}

// Staff Models
export interface StaffProfile {
  id: number;
  user: number;
  full_name: string;
  employee_id: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  hire_date: string;
  is_active: boolean;
  created_at: string;
  photo?: string;
  address: string;
  gender: "Male" | "Female";
  national_id: string;
  salary: number;
  supervisor?: number;
  updated_at: string;
}

export interface StaffActivity {
  id: number;
  staff: number;
  activity_type: "application_review" | "student_creation" | "schedule_creation" | "attendance_monitor" | "report_generation";
  description: string;
  timestamp: string;
  ip_address?: string;
  device_info?: string;
  status: "Success" | "Failed";
  verified_by?: number;
  updated_at: string;
}

// Student Models
export interface StudentProfile {
  id: number;
  user: number;
  full_name: string;
  gender: "male" | "female";
  date_of_birth: string;
  national_id: string;
  phone: string;
  email: string;
  address: string;
  department_name?: string;
  major_name?: string;
  class_name?: string;
  study_year?: string;
  semester?: string;
  photo?: string;
  transcript?: string;
  created_at: string;
  department: number;
  major: number;
  class_obj: number;
  academic_year?: number;
  gpa?: number;
  status: "Active" | "Graduated" | "Suspended" | "Dropout";
  parent_name: string;
  parent_phone: string;
  enrollment_date: string;
  updated_at: string;
  remarks?: string;
}

export interface StudentAttendance {
  id: number;
  student: number;
  schedule: number;
  teacher_attendance?: number;
  checkin_time?: string;
  checkout_time?: string;
  duration?: string;
  status: "present" | "late" | "absent";
  created_at: string;
  remarks?: string;
  verified_by?: number;
  location?: string;
  updated_at: string;
}

// Legacy Schedule Types (for backward compatibility)
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface LegacySchedule {
  id: string;
  subject: Subject;
  subjectId: string;
  class: Class;
  classId: string;
  lecturer: User;
  lecturerId: string;
  room: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  academicYear: string;
  semester: string;
  repeatPattern?: "weekly" | "biweekly";
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  student: User;
  studentId: string;
  schedule: Schedule;
  scheduleId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  note?: string;
  createdAt: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
}

// Notification Types
export type NotificationAudience = "All" | "Department" | "Major" | "Class" | "Role";
export type NotificationStatus = "Draft" | "Scheduled" | "Sent";

export interface Notification {
  id: string;
  title: string;
  message: string;
  audience: NotificationAudience;
  targetIds?: string[]; // department/major/class/role IDs
  creator: User;
  creatorId: string;
  scheduledAt?: string;
  sentAt?: string;
  status: NotificationStatus;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardSummary {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  activeClasses: number;
}

export interface RegistrationChartData {
  month: string;
  count: number;
}

export interface MajorDistribution {
  majorName: string;
  count: number;
}

export interface AttendanceByMonth {
  month: string;
  rate: number;
}

export interface RecentActivity {
  id: string;
  type: "user_created" | "class_scheduled" | "announcement" | "course_assigned";
  description: string;
  timestamp: string;
  user?: User;
}

// Student-specific types
export interface StudentDashboard {
  attendanceRate: number;
  gpa: number;
  registeredCourses: number;
  unreadAnnouncements: number;
  performanceData: { semester: string; gpa: number }[];
  attendanceData: { name: string; value: number }[];
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  targetAudience: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  views: number;
  recipients: number;
}

export interface StudentResult {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  totalScore: number;
  grade: string;
  gpa: number;
  semester: string;
  academicYear: string;
}

export interface Feedback {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: "pending" | "replied";
  reply?: string;
  createdAt: string;
  updatedAt: string;
}
