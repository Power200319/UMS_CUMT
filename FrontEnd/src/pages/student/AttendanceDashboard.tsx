import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AttendanceRecord {
  subject: string;
  date: string;
  checkin: string | null;
  checkout: string | null;
  status: 'present' | 'late' | 'absent';
  teacher: string;
}

interface DashboardData {
  student: {
    full_name: string;
    class_name: string;
    attendance_rate: number;
  };
  summary: {
    total_classes: number;
    present: number;
    late: number;
    absent: number;
  };
  recent_attendance: AttendanceRecord[];
  schedule: Array<{
    subject: string;
    date: string;
    time: string;
    room: string;
    teacher: string;
  }>;
}

export default function AttendanceDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real implementation, this would get the current student's data
      const mockData: DashboardData = {
        student: {
          full_name: "John Doe",
          class_name: "CS101",
          attendance_rate: 85.5,
        },
        summary: {
          total_classes: 20,
          present: 17,
          late: 2,
          absent: 1,
        },
        recent_attendance: [
          {
            subject: "Computer Science",
            date: "2024-01-15",
            checkin: "08:05",
            checkout: "09:35",
            status: "late",
            teacher: "Dr. Smith"
          },
          {
            subject: "Mathematics",
            date: "2024-01-14",
            checkin: "09:00",
            checkout: "10:30",
            status: "present",
            teacher: "Prof. Johnson"
          },
          {
            subject: "Physics",
            date: "2024-01-13",
            checkin: null,
            checkout: null,
            status: "absent",
            teacher: "Dr. Brown"
          }
        ],
        schedule: [
          {
            subject: "Computer Science",
            date: "2024-01-16",
            time: "08:00-09:30",
            room: "Room 101",
            teacher: "Dr. Smith"
          },
          {
            subject: "Mathematics",
            date: "2024-01-16",
            time: "10:00-11:30",
            room: "Room 203",
            teacher: "Prof. Johnson"
          }
        ]
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Present</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Late</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="text-center py-8">Unable to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {dashboardData.student.full_name}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.student.attendance_rate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={dashboardData.student.attendance_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.summary.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.summary.late}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{dashboardData.summary.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.schedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{item.subject}</p>
                    <p className="text-sm text-gray-600">{item.teacher} • {item.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.time}</p>
                    <Badge variant="outline">{item.date}</Badge>
                  </div>
                </div>
              ))}
              {dashboardData.schedule.length === 0 && (
                <p className="text-center text-gray-500 py-4">No classes scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recent_attendance.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{record.subject}</p>
                    <p className="text-sm text-gray-600">{record.teacher}</p>
                    <p className="text-xs text-gray-500">{record.date}</p>
                  </div>
                  <div className="text-right">
                    {record.checkin && (
                      <p className="text-sm">Check-in: {record.checkin}</p>
                    )}
                    {getStatusBadge(record.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Check-In</TableHead>
                <TableHead>Check-Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.recent_attendance.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell>{record.teacher}</TableCell>
                  <TableCell>{record.checkin || 'N/A'}</TableCell>
                  <TableCell>{record.checkout || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}