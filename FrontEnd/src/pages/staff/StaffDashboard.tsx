import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Calendar, FileText, Clock, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  pending_applications: number;
  total_teachers: number;
  total_students: number;
  active_schedules: number;
  today_attendance: {
    teachers_checked_in: number;
    students_checked_in: number;
    total_sessions: number;
  };
  recent_activities: Array<{
    id: number;
    type: 'application' | 'attendance' | 'schedule';
    message: string;
    timestamp: string;
  }>;
}

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In a real implementation, this would fetch from multiple APIs
      const mockStats: DashboardStats = {
        pending_applications: 5,
        total_teachers: 45,
        total_students: 1200,
        active_schedules: 12,
        today_attendance: {
          teachers_checked_in: 8,
          students_checked_in: 245,
          total_sessions: 10,
        },
        recent_activities: [
          {
            id: 1,
            type: 'application',
            message: 'New teacher application from Dr. Sarah Johnson',
            timestamp: '2024-01-15T09:30:00Z'
          },
          {
            id: 2,
            type: 'attendance',
            message: 'Math 101 class started - 25 students checked in',
            timestamp: '2024-01-15T08:15:00Z'
          },
          {
            id: 3,
            type: 'schedule',
            message: 'New schedule created for Computer Science 101',
            timestamp: '2024-01-14T16:45:00Z'
          }
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Users className="h-4 w-4" />;
      case 'attendance':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'schedule':
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Unable to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Office Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage teachers, students, and attendance</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          onClick={() => navigate('/staff/teacher-applications')}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <Users className="h-6 w-6" />
          <span>Teacher Applications</span>
        </Button>
        <Button
          onClick={() => navigate('/staff/student-registration')}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <UserCheck className="h-6 w-6" />
          <span>Add Student</span>
        </Button>
        <Button
          onClick={() => navigate('/staff/schedule-management')}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <Calendar className="h-6 w-6" />
          <span>Manage Schedules</span>
        </Button>
        <Button
          onClick={() => navigate('/staff/attendance-monitor')}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <Clock className="h-6 w-6" />
          <span>Monitor Attendance</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending_applications}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total_teachers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-green-600">{stats.total_students}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                <p className="text-2xl font-bold text-purple-600">{stats.active_schedules}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.today_attendance.teachers_checked_in}</p>
              <p className="text-sm text-gray-600">Teachers Checked In</p>
              <p className="text-xs text-gray-500">out of {stats.today_attendance.total_sessions} sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.today_attendance.students_checked_in}</p>
              <p className="text-sm text-gray-600">Students Checked In</p>
              <p className="text-xs text-gray-500">total today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {stats.today_attendance.total_sessions > 0
                  ? Math.round((stats.today_attendance.teachers_checked_in / stats.today_attendance.total_sessions) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">Session Completion</p>
              <p className="text-xs text-gray-500">classes started</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recent_activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="ghost" onClick={() => navigate('/staff/teacher-applications')} className="h-16 flex flex-col">
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-xs">Applications</span>
            </Button>
            <Button variant="ghost" onClick={() => navigate('/staff/students')} className="h-16 flex flex-col">
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs">Students</span>
            </Button>
            <Button variant="ghost" onClick={() => navigate('/staff/teachers')} className="h-16 flex flex-col">
              <UserCheck className="h-5 w-5 mb-1" />
              <span className="text-xs">Teachers</span>
            </Button>
            <Button variant="ghost" onClick={() => navigate('/staff/reports')} className="h-16 flex flex-col">
              <TrendingUp className="h-5 w-5 mb-1" />
              <span className="text-xs">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}