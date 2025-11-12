import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, School, Users, User, Calendar, Filter, UserPlus, AlertTriangle, FileText, GraduationCap } from "lucide-react";
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
  DialogDescription,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { API_ENDPOINTS, get, post, put, del } from "@/api/config";
import type { Class, Major, User as UserType, ClassShift, Semester } from "@/types";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";

export default function Class() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedClassForEnroll, setSelectedClassForEnroll] = useState<Class | null>(null);


  // Form state
  const [formData, setFormData] = useState({
    name: "",
    majorId: "",
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    semester: "1",
    shift: "morning" as ClassShift,
    capacity: 50,
    roomNumber: "TBA",
    classTeacherId: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, majorsRes, usersRes] = await Promise.all([
          get(API_ENDPOINTS.ADMIN.CLASSES),
          get(API_ENDPOINTS.ADMIN.MAJORS),
          get(API_ENDPOINTS.ADMIN.USERS),
        ]);
        setClasses(classesRes.results || classesRes);
        setMajors(majorsRes.results || majorsRes);
        setUsers(usersRes.results || usersRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setClasses([]);
        setMajors([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || majors.find(m => m.id === cls.major)?.department === parseInt(departmentFilter);
    const matchesMajor = majorFilter === "all" || cls.major === parseInt(majorFilter);
    const matchesYear = yearFilter === "all" || cls.academic_year === yearFilter;
    const matchesSemester = semesterFilter === "all" || cls.semester === semesterFilter;
    const matchesStatus = statusFilter === "all" || (cls.is_active ? "active" : "inactive") === statusFilter;
    return matchesSearch && matchesDepartment && matchesMajor && matchesYear && matchesSemester && matchesStatus;
  });

  const handleCreateClass = async () => {
    if (!formData.name.trim() || !formData.majorId) return;

    try {
      const newClass = await post(API_ENDPOINTS.ADMIN.CLASSES, {
        name: formData.name,
        major: parseInt(formData.majorId),
        academic_year: formData.academicYear,
        semester: formData.semester,
        shift: formData.shift,
        max_students: formData.capacity,
        room_number: formData.roomNumber,
        class_teacher: formData.classTeacherId ? parseInt(formData.classTeacherId) : null,
        is_active: formData.status === 'active',
        current_students: 0,
      });
      setClasses(prev => [...prev, newClass]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleEditClass = async () => {
    if (!editingClass || !formData.name.trim() || !formData.majorId) return;

    try {
      const updatedClass = await put(`${API_ENDPOINTS.ADMIN.CLASSES}${editingClass.id}/`, {
        name: formData.name,
        major: parseInt(formData.majorId),
        academic_year: formData.academicYear,
        semester: formData.semester,
        shift: formData.shift,
        max_students: formData.capacity,
        room_number: formData.roomNumber,
        class_teacher: formData.classTeacherId ? parseInt(formData.classTeacherId) : null,
        is_active: formData.status === 'active',
        current_students: editingClass.current_students || 0,
      });
      setClasses(prev => prev.map(cls =>
        cls.id === editingClass.id ? updatedClass : cls
      ));
      resetForm();
      setEditingClass(null);
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async (classId: number) => {
    try {
      await del(`${API_ENDPOINTS.ADMIN.CLASSES}${classId}/`);
      setClasses(prev => prev.filter(cls => cls.id !== classId));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleBulkEnroll = (classId: number, studentIds: string[]) => {
    setClasses(prev => prev.map(cls =>
      cls.id === classId
        ? { ...cls, current_students: Math.min((cls.current_students || 0) + studentIds.length, cls.max_students || 50) }
        : cls
    ));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      majorId: "",
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      semester: "1" as any,
      shift: "morning",
      capacity: 50,
      roomNumber: "TBA",
      classTeacherId: "",
      status: "active",
    });
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      majorId: cls.major?.toString() || "",
      academicYear: cls.academic_year,
      semester: cls.semester,
      shift: cls.shift,
      capacity: cls.max_students,
      roomNumber: cls.room_number || "TBA",
      classTeacherId: cls.class_teacher?.toString() || "",
      status: cls.is_active ? "active" : "inactive",
    });
  };

  const getUniqueValues = (key: keyof Class) => {
    return Array.from(new Set(classes.map(cls => cls[key]))).sort();
  };

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    return years;
  };

  const getCapacityWarning = (currentStudents: number, maxStudents: number) => {
    const percentage = (currentStudents / maxStudents) * 100;
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
        description="Manage class groups and student enrollment"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Classes" },
        ]}
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
                    <School className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold">Create New Class</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Set up a new class group for student enrollment
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger value="basic" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule & Capacity
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="className" className="text-sm font-medium text-foreground">
                          Class Name *
                        </Label>
                        <Input
                          id="className"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., CS101-A, ENG202-B"
                          className="h-11 border-2 focus:border-teal-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="major" className="text-sm font-medium text-foreground">
                          Major *
                        </Label>
                        <Select value={formData.majorId} onValueChange={(value) => setFormData(prev => ({ ...prev, majorId: value }))}>
                          <SelectTrigger className="h-11 border-2 focus:border-teal-500 transition-colors">
                            <SelectValue placeholder="Select major" />
                          </SelectTrigger>
                          <SelectContent>
                            {majors.map(major => (
                              <SelectItem key={major.id} value={major.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                  {major.name} ({major.code})
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="academicYear" className="text-sm font-medium text-foreground">
                          Academic Year
                        </Label>
                        <Select value={formData.academicYear} onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}>
                          <SelectTrigger className="h-11 border-2 focus:border-teal-500 transition-colors">
                            <SelectValue placeholder="Select Academic Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateAcademicYears().map((year) => (
                              <SelectItem key={year} value={year}>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  {year}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="semester" className="text-sm font-medium text-foreground">
                          Semester
                        </Label>
                        <Select value={formData.semester} onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}>
                          <SelectTrigger className="h-11 border-2 focus:border-teal-500 transition-colors">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="classTeacher" className="text-sm font-medium text-foreground">
                        Class Teacher
                      </Label>
                      <Select value={formData.classTeacherId} onValueChange={(value) => setFormData(prev => ({ ...prev, classTeacherId: value }))}>
                        <SelectTrigger className="h-11 border-2 focus:border-teal-500 transition-colors">
                          <SelectValue placeholder="Select class teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-2 border-dashed border-muted-foreground"></div>
                              None (Assign later)
                            </div>
                          </SelectItem>
                          {users.filter(user => user.is_staff).map(user => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="" />
                                  <AvatarFallback className="text-xs">
                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.first_name} {user.last_name}</div>
                                  <div className="text-xs text-muted-foreground">Staff</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="classStatus" className="text-sm font-medium text-foreground">
                        Status
                      </Label>
                      <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="h-11 border-2 focus:border-teal-500 transition-colors">
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
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              Inactive
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="shift" className="text-sm font-medium text-foreground">
                          Shift
                        </Label>
                        <Select value={formData.shift} onValueChange={(value: ClassShift) => setFormData(prev => ({ ...prev, shift: value }))}>
                          <SelectTrigger className="h-11 border-2 focus:border-teal-500 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                Morning
                              </div>
                            </SelectItem>
                            <SelectItem value="afternoon">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                                Afternoon
                              </div>
                            </SelectItem>
                            <SelectItem value="evening">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                                Evening
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="capacity" className="text-sm font-medium text-foreground">
                          Capacity
                        </Label>
                        <Input
                          id="capacity"
                          type="number"
                          min="1"
                          max="200"
                          value={formData.capacity}
                          onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                          placeholder="50"
                          className="h-11 border-2 focus:border-teal-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomNumber" className="text-sm font-medium text-foreground">
                        Room Number
                      </Label>
                      <Input
                        id="roomNumber"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                        placeholder="e.g., A101, B205, LAB-3"
                        className="h-11 border-2 focus:border-teal-500 transition-colors font-mono"
                      />
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                          <School className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-teal-900 dark:text-teal-100">Class Setup Tips</h4>
                          <p className="text-sm text-teal-700 dark:text-teal-300">Ensure optimal class configuration</p>
                        </div>
                      </div>
                      <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
                        <li>• Use descriptive class names (e.g., CS101-A for Computer Science 101 Section A)</li>
                        <li>• Set realistic capacity based on room size and resources</li>
                        <li>• Room numbers help with scheduling and student navigation</li>
                        <li>• Class teacher can be assigned later if needed</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  className="px-6 h-11 border-2 hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateClass}
                  disabled={!formData.name.trim() || !formData.majorId}
                  className="px-6 h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Class
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
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {Array.from(new Set(majors.map(m => m.department))).map(deptId => {
                return (
                  <SelectItem key={deptId} value={deptId.toString()}>{deptId}</SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={majorFilter} onValueChange={setMajorFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Major" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Majors</SelectItem>
              {majors.map(major => (
                <SelectItem key={major.id} value={major.id.toString()}>{major.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {getUniqueValues("academic_year").map((year: string) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Sem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
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

      {/* Classes Table */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          icon={School}
          title="No classes found"
          description="Try adjusting your search criteria or create a new class"
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
                const capacityWarning = getCapacityWarning(cls.current_students || 0, cls.max_students);
                return (
                  <TableRow key={cls.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.room_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{majors.find(m => m.id === cls.major)?.name || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{cls.academic_year}</p>
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
                          <span className="text-sm">{cls.current_students || 0}/{cls.max_students}</span>
                        </div>
                        <Progress
                          value={((cls.current_students || 0) / cls.max_students) * 100}
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
                      {cls.class_teacher ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {users.find(u => u.id === cls.class_teacher)?.first_name?.[0]}{users.find(u => u.id === cls.class_teacher)?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{users.find(u => u.id === cls.class_teacher)?.first_name} {users.find(u => u.id === cls.class_teacher)?.last_name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
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
                            setSelectedClassForEnroll(cls);
                            setIsEnrollDialogOpen(true);
                          }}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Manage Students
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Class</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="editClassName">Class Name *</Label>
                                  <Input
                                    id="editClassName"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter class name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editMajor">Major *</Label>
                                  <Select value={formData.majorId} onValueChange={(value) => setFormData(prev => ({ ...prev, majorId: value }))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select major" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {majors.map(major => (
                                        <SelectItem key={major.id} value={major.id.toString()}>
                                          {major.name} ({major.code})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="editAcademicYear">Academic Year</Label>
                                    <Select value={formData.academicYear} onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Academic Year" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {generateAcademicYears().map((year) => (
                                          <SelectItem key={year} value={year}>
                                            {year}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="editSemester">Semester</Label>
                                    <Select value={formData.semester} onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">Semester 1</SelectItem>
                                        <SelectItem value="2">Semester 2</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="editShift">Shift</Label>
                                    <Select value={formData.shift} onValueChange={(value: ClassShift) => setFormData(prev => ({ ...prev, shift: value }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="morning">Morning</SelectItem>
                                        <SelectItem value="afternoon">Afternoon</SelectItem>
                                        <SelectItem value="evening">Evening</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="editCapacity">Capacity</Label>
                                    <Input
                                      id="editCapacity"
                                      type="number"
                                      min="1"
                                      value={formData.capacity}
                                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="editRoomNumber">Room Number</Label>
                                  <Input
                                    id="editRoomNumber"
                                    value={formData.roomNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                                    placeholder="Enter room number"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editClassTeacher">Class Teacher</Label>
                                  <Select value={formData.classTeacherId} onValueChange={(value) => setFormData(prev => ({ ...prev, classTeacherId: value }))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select class teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {users.filter(user => user.is_staff).map(user => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                          {user.first_name} {user.last_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="editClassStatus">Status</Label>
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
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => {
                                    resetForm();
                                    setEditingClass(null);
                                  }}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditClass} disabled={!formData.name.trim() || !formData.majorId}>
                                    Update Class
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Class</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{cls.name}"? This action cannot be undone and will affect all enrolled students.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteClass(cls.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Enrollment Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Students - {selectedClassForEnroll?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Current enrollment: {selectedClassForEnroll?.current_students || 0}/{selectedClassForEnroll?.max_students}</span>
              </div>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Bulk Add Students
              </Button>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-muted-foreground text-center py-8">
                Student enrollment management would be implemented here
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}