import { useState, useEffect } from "react";
import { Search, Eye, School, Users, User, Calendar, Filter, AlertTriangle } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { mockMajors, mockUsers } from "@/api/mockData";
import type { Class, Major, User as UserType, ClassShift, Semester } from "@/types";

export default function StaffClass() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [majors] = useState<Major[]>(mockMajors);
  const [users] = useState<UserType[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Mock classes data
  const mockClasses: Class[] = [
    {
      id: "class_1",
      code: "CS301",
      name: "Computer Science Year 3",
      majorId: "maj_1",
      major: mockMajors[0],
      academicYear: "2024-2025",
      semester: "1",
      shift: "Morning",
      capacity: 50,
      enrolled: 45,
      homeroomTeacherId: "u_2",
      homeroomTeacher: mockUsers[1],
      status: "active",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "class_2",
      code: "SE401",
      name: "Software Engineering Year 4",
      majorId: "maj_1",
      major: mockMajors[0],
      academicYear: "2024-2025",
      semester: "1",
      shift: "Afternoon",
      capacity: 40,
      enrolled: 38,
      homeroomTeacherId: "u_2",
      homeroomTeacher: mockUsers[1],
      status: "active",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClasses(mockClasses);
      setLoading(false);
    }, 600);
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || cls.major.departmentId === departmentFilter;
    const matchesMajor = majorFilter === "all" || cls.majorId === majorFilter;
    const matchesYear = yearFilter === "all" || cls.academicYear === yearFilter;
    const matchesSemester = semesterFilter === "all" || cls.semester === semesterFilter;
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesMajor && matchesYear && matchesSemester && matchesStatus;
  });

  const getCapacityWarning = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 100) return { level: "error", message: "Class is full" };
    if (percentage >= 90) return { level: "warning", message: "Near capacity" };
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading classes..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Class Management"
        description="View class groups and enrollment information"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff" },
          { label: "Classes" },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
            title="Filter by department"
          >
            <option value="all">All Departments</option>
            {Array.from(new Set(majors.map(m => m.departmentId))).map(deptId => {
              const dept = majors.find(m => m.departmentId === deptId)?.department;
              return dept ? (
                <option key={deptId} value={deptId}>{dept.name}</option>
              ) : null;
            })}
          </select>
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
            title="Filter by major"
          >
            <option value="all">All Majors</option>
            {majors.map(major => (
              <option key={major.id} value={major.id}>{major.code}</option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
            title="Filter by year"
          >
            <option value="all">All Years</option>
            {Array.from(new Set(classes.map(cls => cls.academicYear))).map((year: string) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
            title="Filter by semester"
          >
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-sm"
            title="Filter by status"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Classes Table */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          icon={School}
          title="No classes found"
          description="Try adjusting your search criteria"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Year/Sem</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Homeroom Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => {
                const capacityWarning = getCapacityWarning(cls.enrolled, cls.capacity);
                return (
                  <TableRow key={cls.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cls.major.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{cls.academicYear}</p>
                        <p className="text-muted-foreground">Sem {cls.semester}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{cls.shift}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{cls.enrolled}/{cls.capacity}</span>
                        </div>
                        <Progress
                          value={(cls.enrolled / cls.capacity) * 100}
                          className="h-2 w-20"
                        />
                        {capacityWarning && (
                          <div className={`flex items-center gap-1 text-xs ${
                            capacityWarning.level === "error" ? "text-destructive" : "text-warning"
                          }`}>
                            <AlertTriangle className="h-3 w-3" />
                            {capacityWarning.message}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {cls.homeroomTeacher ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={cls.homeroomTeacher.avatar} />
                            <AvatarFallback className="text-xs">
                              {cls.homeroomTeacher.firstName[0]}{cls.homeroomTeacher.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{cls.homeroomTeacher.firstName} {cls.homeroomTeacher.lastName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Drawer>
                            <DrawerTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                setSelectedClass(cls);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>{selectedClass?.name} Details</DrawerTitle>
                              </DrawerHeader>
                              {selectedClass && (
                                <div className="p-6 space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Class Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <label className="text-sm font-medium">Name</label>
                                          <p>{selectedClass.name}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Code</label>
                                          <p>{selectedClass.code}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Major</label>
                                          <p>{selectedClass.major.name} ({selectedClass.major.code})</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Academic Year</label>
                                          <p>{selectedClass.academicYear}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Semester</label>
                                          <p>{selectedClass.semester}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Shift</label>
                                          <Badge variant="secondary">{selectedClass.shift}</Badge>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Status</label>
                                          <Badge variant={selectedClass.status === "active" ? "default" : "secondary"}>
                                            {selectedClass.status}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Enrollment & Capacity</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <label className="text-sm font-medium">Capacity</label>
                                          <p>{selectedClass.capacity} students</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Enrolled</label>
                                          <p>{selectedClass.enrolled} students</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Available</label>
                                          <p>{selectedClass.capacity - selectedClass.enrolled} spots</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Homeroom Teacher</label>
                                          <p>{selectedClass.homeroomTeacher?.firstName} {selectedClass.homeroomTeacher?.lastName || "Not assigned"}</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Students ({selectedClass.enrolled})</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-center py-8 text-muted-foreground">
                                        Student list would be displayed here
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1">
                                          View All Students
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DrawerContent>
                          </Drawer>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}