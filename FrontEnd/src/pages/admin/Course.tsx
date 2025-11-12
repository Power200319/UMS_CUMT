import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, BookOpen, Building2, GraduationCap, Link, AlertTriangle, Eye } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { API_ENDPOINTS, get, post, put, del } from "@/api/config";
import type { Course, Department, Major, SemesterValue } from "@/types";

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
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    credits: 3,
    departmentId: "",
    majorId: "",
    semester: "1" as SemesterValue,
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

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        code: editingCourse.code,
        title: editingCourse.title,
        description: editingCourse.description || "",
        credits: editingCourse.credits,
        departmentId: editingCourse.department_id.toString(),
        majorId: editingCourse.major ? editingCourse.major.toString() : "",
        semester: editingCourse.semester,
        prerequisiteIds: editingCourse.prerequisiteIds?.map(id => id.toString()) || [],
        status: editingCourse.status,
      });
    }
  }, [editingCourse]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || course.department_id === parseInt(departmentFilter);
    const matchesMajor = majorFilter === "all" || course.major === parseInt(majorFilter);
    const matchesSemester = semesterFilter === "all" || course.semester === semesterFilter;
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesMajor && matchesSemester && matchesStatus;
  });

  const handleCreateCourse = async () => {
    if (!formData.code.trim() || !formData.title.trim() || !formData.departmentId) return;

    try {
      const newCourse = await post(API_ENDPOINTS.ADMIN.COURSES, {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        credits: formData.credits,
        department: parseInt(formData.departmentId),
        major: formData.majorId ? parseInt(formData.majorId) : null,
        semester: formData.semester,
        is_active: formData.status === 'active',
      });
      setCourses(prev => [...prev, newCourse]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course');
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse || !formData.code.trim() || !formData.title.trim() || !formData.departmentId) return;

    try {
      const updatedCourse = await put(`${API_ENDPOINTS.ADMIN.COURSES}${editingCourse.id}/`, {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        credits: formData.credits,
        department: parseInt(formData.departmentId),
        major: formData.majorId ? parseInt(formData.majorId) : null,
        semester: formData.semester,
        is_active: formData.status === 'active',
      });
      setCourses(prev => prev.map(course =>
        course.id === editingCourse.id ? updatedCourse : course
      ));
      resetForm();
      setEditingCourse(null);
    } catch (error) {
      console.error('Failed to update course:', error);
      alert('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await del(`${API_ENDPOINTS.ADMIN.COURSES}${courseId}/`);
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
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
  };

  const openViewDialog = (course: Course) => {
    setViewingCourse(course);
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Create New Course</DialogTitle>
                    <p className="text-sm text-muted-foreground">Add a new course to the catalog</p>
                  </div>
                </div>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="prerequisites" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Prerequisites
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-6 mt-6">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="courseCode" className="text-sm font-medium flex items-center gap-1">
                            Course Code *
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="courseCode"
                            value={formData.code}
                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                            placeholder="e.g., CS101"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="courseTitle" className="text-sm font-medium flex items-center gap-1">
                            Course Title *
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="courseTitle"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter course title"
                            className="h-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courseDescription" className="text-sm font-medium">
                          Description
                        </Label>
                        <Textarea
                          id="courseDescription"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter course description"
                          className="min-h-[100px] resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-sm font-medium flex items-center gap-1">
                            Department *
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select value={formData.departmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value, majorId: "" }))}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {dept.name} ({dept.code})
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="major" className="text-sm font-medium">
                            Major (Optional)
                          </Label>
                          <Select value={formData.majorId} onValueChange={(value) => setFormData(prev => ({ ...prev, majorId: value }))}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select major" />
                            </SelectTrigger>
                            <SelectContent>
                              {majors.filter(major => major.department === parseInt(formData.departmentId)).map(major => (
                                <SelectItem key={major.id} value={major.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    {major.name} ({major.code})
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="details" className="space-y-6 mt-6">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="credits" className="text-sm font-medium">
                            Credits
                          </Label>
                          <Input
                            id="credits"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.credits}
                            onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="semester" className="text-sm font-medium">
                            Semester
                          </Label>
                          <Select value={formData.semester} onValueChange={(value: SemesterValue) => setFormData(prev => ({ ...prev, semester: value }))}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  Semester 1
                                </div>
                              </SelectItem>
                              <SelectItem value="2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Semester 2
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="courseStatus" className="text-sm font-medium">
                            Status
                          </Label>
                          <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Active
                                </div>
                              </SelectItem>
                              <SelectItem value="inactive">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                  Inactive
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="prerequisites" className="space-y-6 mt-6">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Link className="h-5 w-5 text-muted-foreground" />
                          <Label className="text-sm font-medium">Prerequisites</Label>
                          <span className="text-xs text-muted-foreground">(Optional)</span>
                        </div>
                        <div className="border rounded-lg p-4 bg-muted/20 min-h-[200px]">
                          {courses.filter(c => c.department_id === parseInt(formData.departmentId) && c.id !== editingCourse?.id).length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-muted-foreground">
                              <div className="text-center">
                                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No courses available in this department</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-40 overflow-y-auto">
                              {courses.filter(c => c.department_id === parseInt(formData.departmentId) && c.id !== editingCourse?.id).map(course => (
                                <div key={course.id} className="flex items-center space-x-3 p-2 rounded hover:bg-background">
                                  <Checkbox
                                    id={`prereq-${course.id}`}
                                    checked={formData.prerequisiteIds.includes(course.id.toString())}
                                    onCheckedChange={(checked) => {
                                      const newPrereqs = checked
                                        ? [...formData.prerequisiteIds, course.id.toString()]
                                        : formData.prerequisiteIds.filter(id => id !== course.id.toString());
                                      setFormData(prev => ({ ...prev, prerequisiteIds: newPrereqs }));
                                    }}
                                  />
                                  <Label htmlFor={`prereq-${course.id}`} className="text-sm cursor-pointer flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {course.code}
                                      </Badge>
                                      <span className="font-medium">{course.title}</span>
                                      <span className="text-muted-foreground">({course.credits} credits)</span>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }} className="px-6">
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse} disabled={!formData.code.trim() || !formData.title.trim() || !formData.departmentId} className="px-6">
                  <Plus className="h-4 w-4 mr-2" />
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
                <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
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
                <SelectItem key={major.id} value={major.id.toString()}>{major.code}</SelectItem>
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
                    <Badge variant="outline">{course.department_code}</Badge>
                  </TableCell>
                  <TableCell>
                    {course.major ? (
                      <Badge variant="secondary">{course.major_code}</Badge>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewDialog(course)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
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

      {/* Edit Dialog */}
      <Dialog open={editingCourse !== null} onOpenChange={(open) => !open && setEditingCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Edit Course</DialogTitle>
                <p className="text-sm text-muted-foreground">Update course information</p>
              </div>
            </div>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="editCourseCode">Course Code *</Label>
                <Input
                  id="editCourseCode"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="Enter course code (e.g., CS101)"
                />
              </div>
              <div>
                <Label htmlFor="editCourseTitle">Course Title *</Label>
                <Input
                  id="editCourseTitle"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <Label htmlFor="editCourseDescription">Description</Label>
                <Textarea
                  id="editCourseDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter course description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editDepartment">Department *</Label>
                  <Select value={formData.departmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value, majorId: "" }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editMajor">Major (Optional)</Label>
                  <Select value={formData.majorId} onValueChange={(value) => setFormData(prev => ({ ...prev, majorId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.filter(major => major.department === parseInt(formData.departmentId)).map(major => (
                        <SelectItem key={major.id} value={major.id.toString()}>
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
                  <Label htmlFor="editCredits">Credits</Label>
                  <Input
                    id="editCredits"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editSemester">Semester</Label>
                  <Select value={formData.semester} onValueChange={(value: SemesterValue) => setFormData(prev => ({ ...prev, semester: value }))}>
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
                <Label htmlFor="editCourseStatus">Status</Label>
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
                  {courses.filter(c => c.department_id === parseInt(formData.departmentId) && c.id !== editingCourse?.id).map(course => (
                    <div key={course.id} className="flex items-center space-x-3 p-2 rounded hover:bg-background">
                      <Checkbox
                        id={`edit-prereq-${course.id}`}
                        checked={formData.prerequisiteIds.includes(course.id.toString())}
                        onCheckedChange={(checked) => {
                          const newPrereqs = checked
                            ? [...formData.prerequisiteIds, course.id.toString()]
                            : formData.prerequisiteIds.filter(id => id !== course.id.toString());
                          setFormData(prev => ({ ...prev, prerequisiteIds: newPrereqs }));
                        }}
                      />
                      <Label htmlFor={`edit-prereq-${course.id}`} className="text-sm cursor-pointer flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {course.code}
                          </Badge>
                          <span className="font-medium">{course.title}</span>
                          <span className="text-muted-foreground">({course.credits} credits)</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => {
              setEditingCourse(null);
              resetForm();
            }} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleEditCourse} disabled={!formData.code.trim() || !formData.title.trim() || !formData.departmentId} className="px-6">
              <Edit className="h-4 w-4 mr-2" />
              Update Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewingCourse !== null} onOpenChange={(open) => !open && setViewingCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Course Details</DialogTitle>
                <p className="text-sm text-muted-foreground">View complete course information</p>
              </div>
            </div>
          </DialogHeader>
          {viewingCourse && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Course Code</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {viewingCourse.code}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Course Title</Label>
                      <p className="text-sm font-medium">{viewingCourse.title}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Credits</Label>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{viewingCourse.credits} credits</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Semester</Label>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${viewingCourse.semester === '1' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                        <span className="text-sm">Semester {viewingCourse.semester}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</Label>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{viewingCourse.department_code}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Major</Label>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{viewingCourse.major_code || 'General'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
                      <Badge variant={viewingCourse.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                        {viewingCourse.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created At</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(viewingCourse.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Updated</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(viewingCourse.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {viewingCourse.description && (
                    <div className="mt-6 pt-6 border-t space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</Label>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm leading-relaxed">{viewingCourse.description}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <div className="flex justify-end pt-6 border-t">
            <Button variant="outline" onClick={() => setViewingCourse(null)} className="px-6">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}