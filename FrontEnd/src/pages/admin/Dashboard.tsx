import { useEffect, useState } from "react";
import { Users, GraduationCap, BookOpen, School, Plus, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ENDPOINTS, get } from "@/api/config";
import type { DashboardSummary, RecentActivity } from "@/types";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [majorDistribution, setMajorDistribution] = useState<any[]>([]);
  const [attendanceByMonth, setAttendanceByMonth] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, activityRes, registrationRes, majorRes, attendanceRes] = await Promise.all([
          get(API_ENDPOINTS.ADMIN.DASHBOARD),
          get(`${API_ENDPOINTS.ADMIN.DASHBOARD}/activity`),
          get(`${API_ENDPOINTS.ADMIN.DASHBOARD}/registrations`),
          get(`${API_ENDPOINTS.ADMIN.DASHBOARD}/majors`),
          get(`${API_ENDPOINTS.ADMIN.DASHBOARD}/attendance`),
        ]);

        setSummary(summaryRes);
        setRecentActivity(activityRes);
        setRegistrationData(registrationRes);
        setMajorDistribution(majorRes);
        setAttendanceByMonth(attendanceRes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set empty data if API fails
        setSummary({
          totalStudents: 0,
          totalTeachers: 0,
          activeCourses: 0,
          activeClasses: 0,
        });
        setRecentActivity([]);
        setRegistrationData([]);
        setMajorDistribution([]);
        setAttendanceByMonth([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your system."
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
            <Button>
              <Megaphone className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={summary.totalStudents.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Total Teachers"
          value={summary.totalTeachers}
          icon={GraduationCap}
        />
        <StatCard
          title="Active Courses"
          value={summary.activeCourses}
          icon={BookOpen}
        />
        <StatCard
          title="Active Classes"
          value={summary.activeClasses}
          icon={School}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Registrations (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="Registrations" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Major Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={majorDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ majorName, percent }) => `${majorName}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                >
                  {majorDistribution.map((entry, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="rate" fill="hsl(var(--accent))" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: "User Management", icon: Users, href: "/admin/users" },
              { label: "Departments", icon: Building2, href: "/admin/departments" },
              { label: "Majors", icon: GraduationCap, href: "/admin/majors" },
              { label: "Classes", icon: School, href: "/admin/classes" },
              { label: "Courses", icon: BookOpen, href: "/admin/courses" },
              { label: "Schedule", icon: Calendar, href: "/admin/schedule" },
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:bg-primary/5 hover:border-primary/50 transition-all"
                onClick={() => window.location.href = action.href}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import missing icons
import { Building2, Calendar } from "lucide-react";
