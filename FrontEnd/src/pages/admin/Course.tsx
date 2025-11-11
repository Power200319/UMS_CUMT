import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, BookOpen, Building2, GraduationCap, Link, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ENDPOINTS, get } from "@/api/config";
import type { Course, Department, Major, Semester } from "@/types";

export default function Course() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState<Course | null>(null);


  // Form state
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    credits: 3,
    departmentId: "",
    majorId: "",
    semester: "1" as Semester,
    prerequisiteIds: [] as string[],
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, departmentsRes, majorsRes] = await Promise.all([
          get(API_ENDPOINTS.ADMIN.COURSES),
          get(API_ENDPOINTS.ADMIN.DEPARTMENTS),
          get(API_ENDPOINTS.ADMIN.MAJORS),
        ]);
        setCourses(coursesRes);
        setDepartments(departmentsRes);
        setMajors(majorsRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setCourses([]);
        setDepartments([]);
        setMajors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || course.departmentId === departmentFilter;
    const matchesMajor = majorFilter === "all" || course.majorId === majorFilter;
    const matchesSemester = semesterFilter === "all" || course.semester === semesterFilter;
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesMajor && matchesSemester && matchesStatus;
  });

  const handleCreateCourse = () => {
    if (!formData.code.trim() || !formData.title.trim() || !formData.departmentId) return;

    // Check for unique code
    if (courses.some(course => course.code === formData.code && course.id !== editingCourse?.id)) {
      alert("Course code must be unique");
      return;
    }

    const department = departments.find(d => d.id === formData.departmentId);
    const major = majors.find(m => m.id === formData.majorId);
    const prerequisites = courses.filter(c => formData.prerequisiteIds.includes(c.id));

    if (!department) return;

    const newCourse: Course = {
      id: `course_${Date.now()}`,
      code: formData.code,
      title: formData.title,
      description: formData.description,
      credits: formData.credits,
      departmentId: formData.departmentId,
      department,
      majorId: formData.majorId || undefined,
      major: major,
      semester: formData.semester,
      prerequisites,
      prerequisiteIds: formData.prerequisiteIds,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCourses(prev => [...prev, newCourse]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditCourse = () => {
    if (!editingCourse || !formData.code.trim() || !formData.title.trim() || !formData.departmentId) return;

    // Check for unique code
    if (courses.some(course => course.code === formData.code && course.id !== editingCourse.id)) {
      alert("Course code must be unique");
      return;
    }

    const department = departments.find(d => d.id === formData.departmentId);
    const major = majors.find(m => m.id === formData.majorId);
    const prerequisites = courses.filter(c => formData.prerequisiteIds.includes(c.id));

    if (!department) return;

    const updatedCourse: Course = {
      ...editingCourse,
      code: formData.code,
      title: formData.title,
      description: formData.description,
      credits: formData.credits,
      departmentId: formData.departmentId,
      department,
      majorId: formData.majorId || undefined,
      major: major,
      semester: formData.semester,
      prerequisites,
      prerequisiteIds: formData.prerequisiteIds,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    setCourses(prev => prev.map(course =>
      course.id === editingCourse.id ? updatedCourse : course
    ));
    resetForm();
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      title: "",
      description: "",
      credits: 3,
      departmentId: "",
      majorId: "",
      semester: "1",
      prerequisiteIds: [],
      status: "active",
    });
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      description: course.description || "",
      credits: course.credits,
      departmentId: course.departmentId,
      majorId: course.majorId || "",
      semester: course.semester,
      prerequisiteIds: course.prerequisiteIds,
      status: course.status,
    });
  };

  const getPrerequisiteChain = (course: Course): Course[] => {
    const chain: Course[] = [];
    const visited = new Set<string>();

    const traverse = (currentCourse: Course) => {
      if (visited.has(currentCourse.id)) return;
      visited.add(currentCourse.id);

      currentCourse.prerequisites.forEach(prereq => {
        traverse(prereq);
      });

      chain.unshift(currentCourse);
    };

    traverse(course);
    return chain.slice(0, -1); // Remove the course itself
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading courses..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Course Management"
        description="Manage course catalog and academic subjects"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Courses" },
        ]}
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="courseCode">Course Code *</Label>
                    <Input
                      id="courseCode"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="Enter course code (e.g., CS101)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courseTitle">Course Title *</Label>
                    <Input
                      id="courseTitle"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter course title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courseDescription">Description</Label>
                    <Textarea
                      id="courseDescription"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter course description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.departmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value, majorId: "" }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="major">Major (Optional)</Label>
                      <Select value={formData.majorId} onValueChange={(value) => setFormData(prev => ({ ...prev, majorId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select major" />
                        </SelectTrigger>
                        <SelectContent>
                          {majors.filter(major => major.departmentId === formData.departmentId).map(major => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name} ({major.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="credits">Credits</Label>
                      <Input
                        id="credits"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.credits}
                        onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Select value={formData.semester} onValueChange={(value: Semester) => setFormData(prev => ({ ...prev, semester: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="courseStatus">Status</Label>
                    <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="prerequisites" className="space-y-4">
                  <div>
                    <Label>Prerequisites</Label>
                    <div className="border rounded p-4 space-y-2 max-h-40 overflow-y-auto">
                      {courses.filter(c => c.departmentId === formData.departmentId && c.id !== editingCourse?.id).map(course => (
                        <div key={course.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`prereq-${course.id}`}
                            checked={formData.prerequisiteIds.includes(course.id)}
                            onChange={(e) => {
                              const newPrereqs = e.target.checked
                                ? [...formData.prerequisiteIds, course.id]
                                : formData.prerequisiteIds.filter(id => id !== course.id);
                              setFormData(prev => ({ ...prev, prerequisiteIds: newPrereqs }));
                            }}
                            title={`${course.code} - ${course.title}`}
                          />
                          <Label htmlFor={`prereq-${course.id}`} className="text-sm">
                            {course.code} - {course.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse} disabled={!formData.code.trim() || !formData.title.trim() || !formData.departmentId}>
                  Create Course
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <Building2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={majorFilter} onValueChange={setMajorFilter}>
            <SelectTrigger className="w-32">
              <GraduationCap className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Major" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Majors</SelectItem>
              {majors.map(major => (
                <SelectItem key={major.id} value={major.id}>{major.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Sem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Table */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try adjusting your search criteria or create a new course"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Prerequisites</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.department.code}</Badge>
                  </TableCell>
                  <TableCell>
                    {course.major ? (
                      <Badge variant="secondary">{course.major.code}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">General</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{course.credits} credits</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Sem {course.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    {course.prerequisites.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {course.prerequisites.slice(0, 2).map(prereq => (
                          <Badge key={prereq.id} variant="outline" className="text-xs">
                            {prereq.code}
                          </Badge>
                        ))}
                        {course.prerequisites.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.prerequisites.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedCourseForAssign(course);
                          setIsAssignDialogOpen(true);
                        }}>
                          <Link className="mr-2 h-4 w-4" />
                          Assign to Class
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(course)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{course.title}"? This action cannot be undone and may affect course schedules and student records.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Assign to Class Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Course to Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Course: {selectedCourseForAssign?.title} ({selectedCourseForAssign?.code})</Label>
            </div>
            <div className="border rounded p-4">
              <p className="text-muted-foreground text-center py-8">
                Course assignment to classes would be implemented here
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}