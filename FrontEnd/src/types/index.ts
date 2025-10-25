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
export type UserRole = "Admin" | "Staff" | "Lecturer" | "Student";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles: UserRole[];
  department?: string;
  departmentId?: string;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  roles: UserRole[];
  departmentId?: string;
  status: UserStatus;
}

// Role & Permission Types
export type Permission = "Create" | "Read" | "Update" | "Delete" | "Export";
export type Resource =
  | "Users"
  | "Departments"
  | "Majors"
  | "Classes"
  | "Courses"
  | "Schedule"
  | "Attendance"
  | "Announcements";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<Resource, Permission[]>;
  createdAt: string;
  updatedAt: string;
}

// Department & Major Types
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head?: User;
  headId?: string;
  contactEmail?: string;
  contactPhone?: string;
  majorCount: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export type AcademicLevel = "Bachelor" | "Master" | "Doctorate";

export interface Major {
  id: string;
  name: string;
  code: string;
  department: Department;
  departmentId: string;
  level: AcademicLevel;
  description?: string;
  duration: number; // years
  requiredCredits: number;
  accreditation?: string;
  activeStudents: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Class & Course Types
export type ClassShift = "Morning" | "Afternoon" | "Evening";
export type Semester = "1" | "2";

export interface Class {
  id: string;
  code: string;
  name: string;
  major: Major;
  majorId: string;
  academicYear: string;
  semester: Semester;
  shift: ClassShift;
  capacity: number;
  enrolled: number;
  homeroomTeacher?: User;
  homeroomTeacherId?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  credits: number;
  department: Department;
  departmentId: string;
  major?: Major;
  majorId?: string;
  semester: Semester;
  prerequisites: Course[];
  prerequisiteIds: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Schedule Types
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Schedule {
  id: string;
  course: Course;
  courseId: string;
  class: Class;
  classId: string;
  lecturer: User;
  lecturerId: string;
  room: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  academicYear: string;
  semester: Semester;
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

export interface StudentProfile {
  studentId: string;
  avatar?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    nationality: string;
    address: string;
  };
  academicInfo: {
    department: string;
    major: string;
    class: string;
    year: string;
    advisor: string;
  };
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

// Settings Types
export interface SystemSettings {
  schoolName: string;
  timezone: string;
  language: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string;
  primaryColor: string;
  passwordMinLength: number;
  passwordRequireSpecialChar: boolean;
  otpEnabled: boolean;
  sessionTimeout: number; // minutes
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smsProvider?: string;
  smsApiKey?: string;
}
