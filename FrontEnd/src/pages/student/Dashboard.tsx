import { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen, Bell, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Loader } from "@/components/common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS, get } from "@/api/config";
import type { StudentDashboard, Announcement, Schedule, StudentProfile } from "@/types";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student profile - assuming user ID is available from auth context
        const profileRes = await get(`${API_ENDPOINTS.STUDENT.STUDENT_PROFILES}1/`); // Replace with actual user ID
        setStudentProfile(profileRes);

        // For now, use mock data until dashboard API is implemented
        const mockDashboard: StudentDashboard = {
          attendanceRate: 87,
          gpa: 3.2,
          registeredCourses: 5,
          unreadAnnouncements: 3,
          performanceData: [
            { semester: "Fall 2023", gpa: 3.0 },
            { semester: "Spring 2024", gpa: 3.1 },
            { semester: "Fall 2024", gpa: 3.2 },
          ],
          attendanceData: [
            { name: "Present", value: 87 },
            { name: "Absent", value: 13 },
          ],
        };
        setDashboard(mockDashboard);
        setAnnouncements([]); // Replace with actual API call when available
        setUpcomingSchedule([]); // Replace with actual API call when available
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to mock data
        const mockDashboard: StudentDashboard = {
          attendanceRate: 87,
          gpa: 3.2,
          registeredCourses: 5,
          unreadAnnouncements: 3,
          performanceData: [
            { semester: "Fall 2023", gpa: 3.0 },
            { semester: "Spring 2024", gpa: 3.1 },
            { semester: "Fall 2024", gpa: 3.2 },
          ],
          attendanceData: [
            { name: "Present", value: 87 },
            { name: "Absent", value: 13 },
          ],
        };
        setDashboard(mockDashboard);
        setAnnouncements([]);
        setUpcomingSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Student Dashboard"
        description="Welcome back! Here's an overview of your academic progress."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Attendance Rate"
          value={`${dashboard.attendanceRate}%`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="GPA"
          value={dashboard.gpa.toFixed(2)}
          icon={TrendingUp}
          trend={{ value: 0.2, isPositive: true }}
        />
        <StatCard
          title="Registered Courses"
          value={dashboard.registeredCourses.toString()}
          icon={BookOpen}
          trend={{ value: 1, isPositive: true }}
        />
        <StatCard
          title="Unread Announcements"
          value={dashboard.unreadAnnouncements.toString()}
          icon={Bell}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance over Semesters</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboard.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="gpa" stroke="hsl(var(--primary))" strokeWidth={2} name="GPA" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance vs Absence</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboard.attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {dashboard.attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Schedule & Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedule.map((schedule) => (
                <div key={schedule.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Subject ID: {schedule.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(schedule.date).toLocaleDateString()} • {schedule.start_time} - {schedule.end_time}
                    </p>
                    <p className="text-sm text-muted-foreground">Room: {schedule.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-primary mt-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{announcement.title}</p>
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}