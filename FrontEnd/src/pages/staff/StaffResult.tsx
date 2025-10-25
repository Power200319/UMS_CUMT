import { useState, useEffect } from "react";
import { Search, FileText, Award, TrendingUp, Download, Upload, Eye, Edit } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockUsers } from "@/api/mockData";
import type { User as UserType } from "@/types";

type ResultRecord = {
  id: string;
  studentId: string;
  student: UserType;
  classId: string;
  className: string;
  courseId: string;
  courseName: string;
  semester: string;
  academicYear: string;
  midtermScore?: number;
  finalScore?: number;
  totalScore?: number;
  grade: string;
  status: "passed" | "failed" | "incomplete";
  credits: number;
  gpa: number;
};

export default function StaffResult() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Mock results data
  const mockResults: ResultRecord[] = [
    {
      id: "res_1",
      studentId: "u_3",
      student: mockUsers[2],
      classId: "class_1",
      className: "CS301",
      courseId: "course_1",
      courseName: "Data Structures",
      semester: "1",
      academicYear: "2024-2025",
      midtermScore: 85,
      finalScore: 90,
      totalScore: 87.5,
      grade: "A",
      status: "passed",
      credits: 3,
      gpa: 4.0,
    },
    {
      id: "res_2",
      studentId: "u_3",
      student: mockUsers[2],
      classId: "class_1",
      className: "CS301",
      courseId: "course_2",
      courseName: "Algorithms",
      semester: "1",
      academicYear: "2024-2025",
      midtermScore: 78,
      finalScore: 82,
      totalScore: 80,
      grade: "B+",
      status: "passed",
      credits: 3,
      gpa: 3.5,
    },
    {
      id: "res_3",
      studentId: "u_3",
      student: mockUsers[2],
      classId: "class_1",
      className: "CS301",
      courseId: "course_3",
      courseName: "Database Systems",
      semester: "1",
      academicYear: "2024-2025",
      midtermScore: 65,
      finalScore: 70,
      totalScore: 67.5,
      grade: "C",
      status: "passed",
      credits: 3,
      gpa: 2.0,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 600);
  }, []);

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || result.classId === classFilter;
    const matchesSemester = semesterFilter === "all" || result.semester === semesterFilter;
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    return matchesSearch && matchesClass && matchesSemester && matchesStatus;
  });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-600";
      case "B+":
      case "B":
        return "text-blue-600";
      case "C+":
      case "C":
        return "text-yellow-600";
      case "D+":
      case "D":
      case "F":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: "default",
      failed: "destructive",
      incomplete: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getResultStats = () => {
    const total = results.length;
    const passed = results.filter(r => r.status === "passed").length;
    const failed = results.filter(r => r.status === "failed").length;
    const incomplete = results.filter(r => r.status === "incomplete").length;
    const avgGPA = results.reduce((sum, r) => sum + r.gpa, 0) / total;

    return { total, passed, failed, incomplete, avgGPA };
  };

  const stats = getResultStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading results..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Result Management"
        description="View and manage student academic results"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff" },
          { label: "Results" },
        ]}
        actions={
          <div className="flex gap-2">
            <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Result Import</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Upload CSV File</label>
                    <Input type="file" accept=".csv" className="mt-1" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a CSV file with student result data
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        }
      />

      {/* Result Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
            <Progress value={(stats.passed / stats.total) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <Progress value={(stats.failed / stats.total) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplete</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.incomplete}</div>
            <Progress value={(stats.incomplete / stats.total) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgGPA.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="class_1">CS301</SelectItem>
              <SelectItem value="class_2">SE401</SelectItem>
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Table */}
      {filteredResults.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No results found"
          description="Try adjusting your search criteria"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Scores</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={result.student.avatar} />
                        <AvatarFallback>
                          {result.student.firstName[0]}{result.student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{result.student.firstName} {result.student.lastName}</p>
                        <p className="text-sm text-muted-foreground">{result.student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{result.courseName}</p>
                      <p className="text-sm text-muted-foreground">{result.credits} credits</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.className}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {result.midtermScore && <p>Mid: {result.midtermScore}</p>}
                      {result.finalScore && <p>Final: {result.finalScore}</p>}
                      {result.totalScore && <p className="font-medium">Total: {result.totalScore}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold text-lg ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(result.status)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{result.gpa.toFixed(1)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Result
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Transcript
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}