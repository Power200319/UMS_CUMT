import { Users, UserPlus, School, Award, TrendingUp, Bell } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS, get } from "@/api/config";
import { useState, useEffect } from "react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

interface DashboardData {
  totalStudents: number;
  newRegistrations: number;
  activeClasses: number;
  certificatesIssued: number;
  attendanceRate: number;
  registrationTrend: Array<{ month: string; count: number }>;
  departmentDistribution: Array<{ name: string; count: number }>;
}

export default function StaffDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For now, use mock data until dashboard API is implemented
        const mockData: DashboardData = {
          totalStudents: 1250,
          newRegistrations: 45,
          activeClasses: 28,
          certificatesIssued: 156,
          attendanceRate: 87,
          registrationTrend: [
            { month: 'Aug', count: 120 },
            { month: 'Sep', count: 145 },
            { month: 'Oct', count: 132 },
            { month: 'Nov', count: 158 },
            { month: 'Dec', count: 142 },
            { month: 'Jan', count: 45 },
          ],
          departmentDistribution: [
            { name: 'Computer Science', count: 320 },
            { name: 'Business Admin', count: 280 },
            { name: 'Engineering', count: 250 },
            { name: 'Arts & Humanities', count: 180 },
            { name: 'Science', count: 220 },
          ],
        };
        setDashboardData(mockData);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Office Dashboard"
        description="Welcome back! Here's an overview of your academic office."
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <>
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Register New Student
            </Button>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={dashboardData.totalStudents.toLocaleString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="New Registrations"
          value={dashboardData.newRegistrations.toString()}
          icon={UserPlus}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Classes"
          value={dashboardData.activeClasses.toString()}
          icon={School}
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          title="Certificates Issued"
          value={dashboardData.certificatesIssued.toString()}
          icon={Award}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registration Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.registrationTrend}>
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
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Registrations"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                >
                  {dashboardData.departmentDistribution.map((entry, index) => (
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

      {/* Quick Actions & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <UserPlus className="h-6 w-6" />
                <span className="text-sm">Register Student</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <School className="h-6 w-6" />
                <span className="text-sm">Manage Classes</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Award className="h-6 w-6" />
                <span className="text-sm">Issue Certificate</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b last:border-0">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mid-term Exam Schedule</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Exams will start from March 15th. Check your class schedule.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b last:border-0">
                <div className="p-2 rounded-lg bg-green-100">
                  <Bell className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Student Registration</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registration for the new academic year is now open.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Bell className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System Maintenance</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scheduled maintenance tonight from 2-4 AM.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-blue-600">
                  {dashboardData.attendanceRate}%
                </span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  +2.1% from last month
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Average attendance rate across all classes this month
              </p>
            </div>
            <div className="w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeDasharray={`${dashboardData.attendanceRate}, 100`}
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}