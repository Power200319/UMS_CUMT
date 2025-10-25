import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, BookOpen, Calendar, Download, Eye, Star, Clock, Target } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { mockTeachingReports } from "@/api/mockData";
import { useResponsive } from "@/hooks/useResponsive";
import type { User } from "@/types";

interface TeachingReport {
  id: string;
  lecturerId: string;
  lecturer: User;
  title: string;
  type: "performance" | "analytics";
  period: string;
  courses: Array<{
    courseId: string;
    courseName: string;
    classCode: string;
    studentsEnrolled: number;
    averageScore: number;
    attendanceRate: number;
    studentSatisfaction: number;
    weeklyAttendance?: number[];
    assignmentCompletion?: number;
    quizAverage?: number;
    participationScore?: number;
  }>;
  overallMetrics: {
    totalStudents: number;
    averageScore: number;
    averageAttendance: number;
    averageSatisfaction: number;
    teachingHours: number;
    researchPublications: number;
  };
  status: "completed" | "pending";
  generatedAt: string;
  createdAt: string;
}

export default function ReportTeaching() {
  const { isMobile, isTablet } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<TeachingReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<TeachingReport | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(mockTeachingReports as TeachingReport[]);
      setLoading(false);
    }, 800);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading teaching reports..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teaching Reports & Analytics"
        description="View your teaching performance and course analytics"
        aria-label="Teaching reports and analytics page header"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Reports</TabsTrigger>
          <TabsTrigger value="analytics">Course Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Students</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">63</div>
                <p className="text-xs text-blue-600">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Average Score</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">80.7%</div>
                <p className="text-xs text-blue-600">+2.3% from last semester</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Attendance Rate</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">90%</div>
                <p className="text-xs text-blue-600">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Student Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4.35</div>
                <p className="text-xs text-blue-600">Out of 5.0</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-blue-900">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-all duration-300 animate-fade-in">
                    <div className="space-y-1">
                      <h4 className="font-medium text-blue-900">{report.title}</h4>
                      <p className="text-sm text-blue-600">{report.period}</p>
                      <div className="flex items-center gap-4 text-xs text-blue-600">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {report.courses.length} courses
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {report.overallMetrics.totalStudents} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {report.type}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                        className="border-blue-200 hover:bg-blue-50"
                        aria-label={`View ${report.title} report`}
                      >
                        <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 hover:bg-blue-50"
                        aria-label={`Download ${report.title} report`}
                      >
                        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {reports.filter(r => r.type === "performance").map((report) => (
            <Card key={report.id} className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center justify-between">
                  <span>{report.title}</span>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {report.period}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Metrics */}
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{report.overallMetrics.totalStudents}</div>
                    <div className="text-sm text-blue-600">Total Students</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getScoreColor(report.overallMetrics.averageScore)}`}>
                      {report.overallMetrics.averageScore}%
                    </div>
                    <div className="text-sm text-blue-600">Average Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{report.overallMetrics.averageAttendance}%</div>
                    <div className="text-sm text-blue-600">Attendance Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getSatisfactionColor(report.overallMetrics.averageSatisfaction)}`}>
                      {report.overallMetrics.averageSatisfaction}
                    </div>
                    <div className="text-sm text-blue-600">Satisfaction</div>
                  </div>
                </div>

                <Separator />

                {/* Course Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-900">Course Performance</h3>
                  {report.courses.map((course, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-blue-900">{course.courseName}</h4>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {course.classCode}
                        </Badge>
                      </div>

                      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
                        <div>
                          <div className="text-sm text-blue-600">Students</div>
                          <div className="font-medium text-blue-900">{course.studentsEnrolled}</div>
                        </div>
                        <div>
                          <div className="text-sm text-blue-600">Average Score</div>
                          <div className={`font-medium ${getScoreColor(course.averageScore)}`}>
                            {course.averageScore}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-blue-600">Attendance</div>
                          <div className="font-medium text-blue-900">{course.attendanceRate}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-blue-600">Satisfaction</div>
                          <div className={`font-medium ${getSatisfactionColor(course.studentSatisfaction)}`}>
                            {course.studentSatisfaction}/5
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {reports.filter(r => r.type === "analytics").map((report) => (
            <Card key={report.id} className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center justify-between">
                  <span>{report.title}</span>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {report.period}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {report.courses.map((course, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-blue-900">{course.courseName}</h3>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {course.classCode}
                      </Badge>
                    </div>

                    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600">Assignment Completion</span>
                          <span className="font-medium text-blue-900">{course.assignmentCompletion}%</span>
                        </div>
                        <Progress value={course.assignmentCompletion} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600">Quiz Average</span>
                          <span className="font-medium text-blue-900">{course.quizAverage}%</span>
                        </div>
                        <Progress value={course.quizAverage} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600">Participation Score</span>
                          <span className="font-medium text-blue-900">{course.participationScore}/5</span>
                        </div>
                        <Progress value={(course.participationScore! / 5) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600">Weekly Attendance</span>
                          <span className="font-medium text-blue-900">
                            {course.weeklyAttendance?.reduce((a, b) => a + b, 0) / (course.weeklyAttendance?.length || 1)}%
                          </span>
                        </div>
                        <Progress
                          value={course.weeklyAttendance?.reduce((a, b) => a + b, 0) / (course.weeklyAttendance?.length || 1)}
                          className="h-2"
                        />
                      </div>
                    </div>

                    {course.weeklyAttendance && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-blue-900">Weekly Attendance Trend</h4>
                        <div className="flex gap-2">
                          {course.weeklyAttendance.map((rate, weekIndex) => (
                            <div key={weekIndex} className="flex-1 text-center">
                              <div className="text-xs text-blue-600 mb-1">Week {weekIndex + 1}</div>
                              <div className="bg-blue-100 rounded p-2">
                                <div className="text-sm font-medium text-blue-900">{rate}%</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}