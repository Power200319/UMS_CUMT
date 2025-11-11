import { useState, useEffect } from "react";
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Users, Clock, CheckCircle, XCircle, AlertTriangle, BarChart3, PieChart, LineChart } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { API_ENDPOINTS, get } from "@/api/config";
import { BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { Department, Major } from "@/types";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export default function AttendanceReport() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    start: "2024-09-01",
    end: "2024-12-31",
  });
  const [filters, setFilters] = useState({
    department: "all",
    major: "all",
    class: "all",
    course: "all",
    lecturer: "all",
  });

  // Mock data
  const mockSummary = {
    totalClasses: 245,
    presentCount: 185,
    absentCount: 45,
    lateCount: 15,
    attendanceRate: 87.5,
  };

  const mockClassAttendance = [
    { className: "CS301", attendanceRate: 92, totalStudents: 45, present: 41, absent: 4 },
    { className: "CS302", attendanceRate: 88, totalStudents: 42, present: 37, absent: 5 },
    { className: "BA201", attendanceRate: 85, totalStudents: 38, present: 32, absent: 6 },
    { className: "BA202", attendanceRate: 90, totalStudents: 40, present: 36, absent: 4 },
  ];

  const mockStudentAttendance = [
    { studentId: "ST001", studentName: "Sokun Doe", className: "CS301", attendanceRate: 95, present: 19, absent: 1, late: 0 },
    { studentId: "ST002", studentName: "Sreyneang Smith", attendanceRate: 88, className: "CS301", present: 18, absent: 2, late: 1 },
    { studentId: "ST003", studentName: "Vichika Johnson", attendanceRate: 92, className: "CS301", present: 18, absent: 1, late: 1 },
    { studentId: "ST004", studentName: "Ratanak Brown", attendanceRate: 85, className: "CS301", present: 17, absent: 3, late: 0 },
  ];

  const mockHeatmapData = Array.from({ length: 31 }, (_, i) => ({
    date: `2024-10-${String(i + 1).padStart(2, '0')}`,
    attendance: Math.floor(Math.random() * 100) + 50,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, majorsRes, attendanceRes] = await Promise.all([
          get(API_ENDPOINTS.ADMIN.DEPARTMENTS),
          get(API_ENDPOINTS.ADMIN.MAJORS),
          get(API_ENDPOINTS.ADMIN.ATTENDANCE),
        ]);
        setDepartments(departmentsRes);
        setMajors(majorsRes);
        setAttendanceData(attendanceRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setDepartments([]);
        setMajors([]);
        setAttendanceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = (format: "csv" | "pdf") => {
    // Simulate export
    console.log(`Exporting attendance report as ${format}`);
  };

  const handleScheduleReport = () => {
    // Simulate scheduling recurring report
    console.log("Scheduling recurring report");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading attendance reports..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Attendance Reports"
        description="Analytics and reports for attendance tracking"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Attendance Reports" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleScheduleReport}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select value={filters.department} onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="major">Major</Label>
              <Select value={filters.major} onValueChange={(value) => setFilters(prev => ({ ...prev, major: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All Majors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  {majors.map(major => (
                    <SelectItem key={major.id} value={major.id.toString()}>{major.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Attendance Rate</p>
                <p className="text-2xl font-bold">{mockSummary.attendanceRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+2.1%</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={mockSummary.attendanceRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{mockSummary.totalClasses}</p>
                <p className="text-sm text-muted-foreground">This period</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent Count</p>
                <p className="text-2xl font-bold">{mockSummary.absentCount}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">-1.2%</span>
                </div>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Late Arrivals</p>
                <p className="text-2xl font-bold">{mockSummary.lateCount}</p>
                <p className="text-sm text-muted-foreground">This period</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">By Class</TabsTrigger>
          <TabsTrigger value="students">By Student</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={attendanceData?.monthly || []}>
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
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} name="Attendance %" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "Present", value: mockSummary.presentCount, fill: COLORS[0] },
                        { name: "Absent", value: mockSummary.absentCount, fill: COLORS[3] },
                        { name: "Late", value: mockSummary.lateCount, fill: COLORS[2] },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: "Present", value: mockSummary.presentCount, fill: COLORS[0] },
                        { name: "Absent", value: mockSummary.absentCount, fill: COLORS[3] },
                        { name: "Late", value: mockSummary.lateCount, fill: COLORS[2] },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockHeatmapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Area type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Class</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockClassAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="className" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="attendanceRate" fill="hsl(var(--primary))" name="Attendance Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Attendance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClassAttendance.map((cls) => (
                    <TableRow key={cls.className}>
                      <TableCell className="font-medium">{cls.className}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={cls.attendanceRate} className="w-20" />
                          <span className="text-sm">{cls.attendanceRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{cls.totalStudents}</TableCell>
                      <TableCell>{cls.present}</TableCell>
                      <TableCell>{cls.absent}</TableCell>
                      <TableCell>
                        <Badge variant={cls.attendanceRate >= 90 ? "default" : cls.attendanceRate >= 80 ? "secondary" : "destructive"}>
                          {cls.attendanceRate >= 90 ? "Excellent" : cls.attendanceRate >= 80 ? "Good" : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudentAttendance.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.studentId}</TableCell>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.className}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.attendanceRate} className="w-20" />
                          <span className="text-sm">{student.attendanceRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.present}</TableCell>
                      <TableCell>{student.absent}</TableCell>
                      <TableCell>{student.late}</TableCell>
                      <TableCell>
                        <Badge variant={student.attendanceRate >= 90 ? "default" : student.attendanceRate >= 80 ? "secondary" : "destructive"}>
                          {student.attendanceRate >= 90 ? "Excellent" : student.attendanceRate >= 80 ? "Good" : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { day: "Mon", attendance: 88 },
                    { day: "Tue", attendance: 92 },
                    { day: "Wed", attendance: 85 },
                    { day: "Thu", attendance: 90 },
                    { day: "Fri", attendance: 87 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="attendance" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { department: "CS", attendance: 89 },
                    { department: "BA", attendance: 87 },
                    { department: "ENG", attendance: 91 },
                    { department: "MATH", attendance: 85 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="attendance" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}