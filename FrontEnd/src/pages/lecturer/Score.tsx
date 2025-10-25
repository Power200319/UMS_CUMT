import { useState, useEffect } from "react";
import { Edit, Save, X, Plus, Search, Filter, Download, Eye, Calculator, Award, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStudentScores } from "@/api/mockData";
import { useResponsive } from "@/hooks/useResponsive";
import type { User } from "@/types";

interface StudentScore {
  id: string;
  studentId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  courseId: string;
  courseName: string;
  classId: string;
  classCode: string;
  semester: string;
  academicYear: string;
  assessments: Array<{
    type: string;
    name: string;
    score: number;
    maxScore: number;
    weight: number;
    date: string;
  }>;
  totalScore: number;
  grade: string;
  status: "graded" | "pending" | "draft";
  lecturerId: string;
  lecturer: User;
  gradedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function Score() {
  const { isMobile, isTablet } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [filteredScores, setFilteredScores] = useState<StudentScore[]>([]);
  const [selectedScore, setSelectedScore] = useState<StudentScore | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingScores, setEditingScores] = useState<{ [key: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setScores(mockStudentScores as StudentScore[]);
      setFilteredScores(mockStudentScores as StudentScore[]);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = scores;

    if (searchTerm) {
      filtered = filtered.filter(score =>
        `${score.student.firstName} ${score.student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        score.student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourse !== "all") {
      filtered = filtered.filter(score => score.courseId === selectedCourse);
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter(score => score.classId === selectedClass);
    }

    setFilteredScores(filtered);
  }, [scores, searchTerm, selectedCourse, selectedClass]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-700 border-green-200";
      case "B+":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "B":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "C+":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "C":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "D":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "F":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const calculateGrade = (totalScore: number): string => {
    if (totalScore >= 90) return "A";
    if (totalScore >= 85) return "B+";
    if (totalScore >= 80) return "B";
    if (totalScore >= 75) return "C+";
    if (totalScore >= 70) return "C";
    if (totalScore >= 60) return "D";
    return "F";
  };

  const handleSaveScores = () => {
    if (!selectedScore) return;

    const updatedAssessments = selectedScore.assessments.map(assessment => ({
      ...assessment,
      score: editingScores[assessment.name] ?? assessment.score
    }));

    const totalScore = updatedAssessments.reduce((sum, assessment) => {
      return sum + (assessment.score / assessment.maxScore) * assessment.weight;
    }, 0);

    const newGrade = calculateGrade(totalScore);

    const updatedScore: StudentScore = {
      ...selectedScore,
      assessments: updatedAssessments,
      totalScore: Math.round(totalScore * 100) / 100,
      grade: newGrade,
      status: "graded",
      gradedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setScores(prev => prev.map(score =>
      score.id === selectedScore.id ? updatedScore : score
    ));

    setIsEditing(false);
    setEditingScores({});
  };

  const getUniqueCourses = () => {
    const courses = scores.map(score => ({
      id: score.courseId,
      name: score.courseName
    }));
    return Array.from(new Set(courses.map(c => c.id)))
      .map(id => courses.find(c => c.id === id)!);
  };

  const getUniqueClasses = () => {
    const classes = scores.map(score => ({
      id: score.classId,
      code: score.classCode
    }));
    return Array.from(new Set(classes.map(c => c.id)))
      .map(id => classes.find(c => c.id === id)!);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading student scores..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Score Management"
        description="View and manage student grades and assessments"
        actions={
          <Button className="bg-blue-600 hover:bg-blue-700" aria-label="Export all student scores">
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Export Scores
          </Button>
        }
        aria-label="Student score management page header"
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
            <div className="flex-1">
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {getUniqueCourses().map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:w-48">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {getUniqueClasses().map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scores Table */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-blue-900">Student Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Total Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-blue-900">
                        {score.student.firstName} {score.student.lastName}
                      </div>
                      <div className="text-sm text-blue-600">{score.student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-blue-900">{score.courseName}</div>
                    <div className="text-sm text-blue-600">{score.semester} {score.academicYear}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {score.classCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-blue-900">{score.totalScore}%</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(score.grade)}>
                      {score.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        score.status === "graded"
                          ? "border-green-200 text-green-700"
                          : score.status === "pending"
                          ? "border-yellow-200 text-yellow-700"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      {score.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedScore(score)}
                          className="border-blue-200 hover:bg-blue-50"
                          aria-label={`View score details for ${score.student.firstName} ${score.student.lastName}`}
                        >
                          <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-blue-900">
                            Score Details - {score.student.firstName} {score.student.lastName}
                          </DialogTitle>
                        </DialogHeader>

                        {selectedScore && (
                          <div className="space-y-6">
                            {/* Student Info */}
                            <div className={`grid gap-4 p-4 bg-blue-50 rounded-lg ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                              <div>
                                <h4 className="font-medium text-blue-900 mb-2">Student Information</h4>
                                <p className="text-sm text-blue-600">Name: {selectedScore.student.firstName} {selectedScore.student.lastName}</p>
                                <p className="text-sm text-blue-600">Email: {selectedScore.student.email}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-blue-900 mb-2">Course Information</h4>
                                <p className="text-sm text-blue-600">Course: {selectedScore.courseName}</p>
                                <p className="text-sm text-blue-600">Class: {selectedScore.classCode}</p>
                                <p className="text-sm text-blue-600">Semester: {selectedScore.semester} {selectedScore.academicYear}</p>
                              </div>
                            </div>

                            {/* Assessments */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-blue-900">Assessment Breakdown</h4>
                                {!isEditing ? (
                                  <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Scores
                                  </Button>
                                ) : (
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={handleSaveScores}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Save className="h-4 w-4 mr-2" />
                                      Save Changes
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsEditing(false);
                                        setEditingScores({});
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                {selectedScore.assessments.map((assessment, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-blue-900">{assessment.name}</span>
                                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                                          {assessment.type}
                                        </Badge>
                                      </div>
                                      <div className="text-sm text-blue-600">
                                        Weight: {assessment.weight}% | Date: {new Date(assessment.date).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      {isEditing ? (
                                        <Input
                                          type="number"
                                          min="0"
                                          max={assessment.maxScore}
                                          value={editingScores[assessment.name] ?? assessment.score}
                                          onChange={(e) => setEditingScores(prev => ({
                                            ...prev,
                                            [assessment.name]: parseFloat(e.target.value) || 0
                                          }))}
                                          className="w-20"
                                        />
                                      ) : (
                                        <span className="font-medium text-blue-900">
                                          {assessment.score}/{assessment.maxScore}
                                        </span>
                                      )}
                                      <span className="text-sm text-blue-600 w-12 text-right">
                                        ({((assessment.score / assessment.maxScore) * 100).toFixed(1)}%)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Final Grade */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-blue-900">Final Grade</h4>
                                  <p className="text-sm text-blue-600">
                                    Total Score: {selectedScore.totalScore}% | Grade: {selectedScore.grade}
                                  </p>
                                </div>
                                <Badge className={`${getGradeColor(selectedScore.grade)} text-lg px-3 py-1`}>
                                  {selectedScore.grade}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredScores.length === 0 && (
            <div className="text-center py-12">
              <Calculator className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">No Scores Found</h3>
              <p className="text-blue-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}