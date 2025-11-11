import { useState, useEffect } from "react";
import { FileText, Download, TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReportData {
  teacher_reports: Array<{
    teacher_name: string;
    subject: string;
    total_classes: number;
    present_classes: number;
    attendance_rate: number;
  }>;
  student_reports: Array<{
    student_name: string;
    class_name: string;
    total_classes: number;
    present_classes: number;
    late_classes: number;
    attendance_rate: number;
  }>;
  class_reports: Array<{
    class_name: string;
    total_students: number;
    average_attendance: number;
    subject: string;
  }>;
}

export default function StaffReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('teacher');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      // Mock report data
      const mockData: ReportData = {
        teacher_reports: [
          {
            teacher_name: "Dr. Smith",
            subject: "Computer Science",
            total_classes: 20,
            present_classes: 18,
            attendance_rate: 90.0
          },
          {
            teacher_name: "Prof. Johnson",
            subject: "Mathematics",
            total_classes: 22,
            present_classes: 20,
            attendance_rate: 90.9
          }
        ],
        student_reports: [
          {
            student_name: "John Doe",
            class_name: "CS101",
            total_classes: 20,
            present_classes: 18,
            late_classes: 2,
            attendance_rate: 90.0
          },
          {
            student_name: "Jane Smith",
            class_name: "CS101",
            total_classes: 20,
            present_classes: 16,
            late_classes: 1,
            attendance_rate: 80.0
          }
        ],
        class_reports: [
          {
            class_name: "CS101",
            total_students: 30,
            average_attendance: 85.5,
            subject: "Computer Science"
          },
          {
            class_name: "MATH201",
            total_students: 28,
            average_attendance: 88.2,
            subject: "Mathematics"
          }
        ]
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type: string) => {
    // In a real implementation, this would generate and download a file
    alert(`Exporting ${type} report...`);
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  if (!reportData) {
    return <div className="text-center py-8">Unable to load report data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate attendance and performance reports</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => exportReport('all')}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{reportData.teacher_reports.length}</p>
              <p className="text-sm text-gray-600">Active Teachers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {reportData.student_reports.reduce((sum, s) => sum + s.total_classes, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {(reportData.teacher_reports.reduce((sum, t) => sum + t.attendance_rate, 0) / reportData.teacher_reports.length).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Avg Teacher Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {(reportData.student_reports.reduce((sum, s) => sum + s.attendance_rate, 0) / reportData.student_reports.length).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Avg Student Attendance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teacher">Teacher Reports</TabsTrigger>
          <TabsTrigger value="student">Student Reports</TabsTrigger>
          <TabsTrigger value="class">Class Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="teacher" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Teacher Attendance Report
                </CardTitle>
                <Button variant="outline" onClick={() => exportReport('teacher')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Total Classes</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.teacher_reports.map((teacher, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{teacher.teacher_name}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>{teacher.total_classes}</TableCell>
                      <TableCell>{teacher.present_classes}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getAttendanceColor(teacher.attendance_rate)}`}>
                          {teacher.attendance_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.attendance_rate >= 90 ? "default" : teacher.attendance_rate >= 80 ? "secondary" : "destructive"}>
                          {teacher.attendance_rate >= 90 ? "Excellent" : teacher.attendance_rate >= 80 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Student Attendance Report
                </CardTitle>
                <Button variant="outline" onClick={() => exportReport('student')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Classes</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.student_reports.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.student_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class_name}</Badge>
                      </TableCell>
                      <TableCell>{student.total_classes}</TableCell>
                      <TableCell>{student.present_classes}</TableCell>
                      <TableCell>{student.late_classes}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getAttendanceColor(student.attendance_rate)}`}>
                          {student.attendance_rate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.attendance_rate >= 85 ? "default" : student.attendance_rate >= 75 ? "secondary" : "destructive"}>
                          {student.attendance_rate >= 85 ? "Good" : student.attendance_rate >= 75 ? "Fair" : "Poor"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="class" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Class Performance Report
                </CardTitle>
                <Button variant="outline" onClick={() => exportReport('class')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Average Attendance</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.class_reports.map((classReport, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{classReport.class_name}</TableCell>
                      <TableCell>{classReport.subject}</TableCell>
                      <TableCell>{classReport.total_students}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getAttendanceColor(classReport.average_attendance)}`}>
                          {classReport.average_attendance.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={classReport.average_attendance >= 85 ? "default" : classReport.average_attendance >= 75 ? "secondary" : "destructive"}>
                          {classReport.average_attendance >= 85 ? "Excellent" : classReport.average_attendance >= 75 ? "Good" : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}