import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, School, Users, User, Calendar, Filter, UserPlus, AlertTriangle } from "lucide-react";
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
import { mockMajors, mockUsers } from "@/api/mockData";
import type { Class, Major, User as UserType, ClassShift, Semester } from "@/types";

export default function Class() {
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedClassForEnroll, setSelectedClassForEnroll] = useState<Class | null>(null);

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

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    majorId: "",
    academicYear: "2024-2025",
    semester: "1" as Semester,
    shift: "Morning" as ClassShift,
    capacity: 50,
    homeroomTeacherId: "",
    status: "active" as "active" | "inactive",
  });

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

  const handleCreateClass = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.majorId) return;

    const major = majors.find(m => m.id === formData.majorId);
    const homeroomTeacher = users.find(u => u.id === formData.homeroomTeacherId);

    if (!major) return;

    const newClass: Class = {
      id: `class_${Date.now()}`,
      code: formData.code,
      name: formData.name,
      majorId: formData.majorId,
      major,
      academicYear: formData.academicYear,
      semester: formData.semester,
      shift: formData.shift,
      capacity: formData.capacity,
      enrolled: 0,
      homeroomTeacherId: formData.homeroomTeacherId || undefined,
      homeroomTeacher: homeroomTeacher,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setClasses(prev => [...prev, newClass]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditClass = () => {
    if (!editingClass || !formData.code.trim() || !formData.name.trim() || !formData.majorId) return;

    const major = majors.find(m => m.id === formData.majorId);
    const homeroomTeacher = users.find(u => u.id === formData.homeroomTeacherId);

    if (!major) return;

    const updatedClass: Class = {
      ...editingClass,
      code: formData.code,
      name: formData.name,
      majorId: formData.majorId,
      major,
      academicYear: formData.academicYear,
      semester: formData.semester,
      shift: formData.shift,
      capacity: formData.capacity,
      homeroomTeacherId: formData.homeroomTeacherId || undefined,
      homeroomTeacher: homeroomTeacher,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    setClasses(prev => prev.map(cls =>
      cls.id === editingClass.id ? updatedClass : cls
    ));
    resetForm();
    setEditingClass(null);
  };

  const handleDeleteClass = (classId: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== classId));
  };

  const handleBulkEnroll = (classId: string, studentIds: string[]) => {
    setClasses(prev => prev.map(cls =>
      cls.id === classId
        ? { ...cls, enrolled: Math.min(cls.enrolled + studentIds.length, cls.capacity) }
        : cls
    ));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      majorId: "",
      academicYear: "2024-2025",
      semester: "1",
      shift: "Morning",
      capacity: 50,
      homeroomTeacherId: "",
      status: "active",
    });
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      code: cls.code,
      name: cls.name,
      majorId: cls.majorId,
      academicYear: cls.academicYear,
      semester: cls.semester,
      shift: cls.shift,
      capacity: cls.capacity,
      homeroomTeacherId: cls.homeroomTeacherId || "",
      status: cls.status,
    });
  };

  const getUniqueValues = (key: keyof Class) => {
    return Array.from(new Set(classes.map(cls => cls[key]))).sort();
  };

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
        description="Manage class groups and student enrollment"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Classes" },
        ]}
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="classCode">Class Code *</Label>
                  <Input
                    id="classCode"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Enter class code (e.g., CS301)"
                  />
                </div>
                <div>
                  <Label htmlFor="className">Class Name *</Label>
                  <Input
                    id="className"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter class name"
                  />
                </div>
                <div>
                  <Label htmlFor="major">Major *</Label>
                  <Select value={formData.majorId} onValueChange={(value) => setFormData(prev => ({ ...prev, majorId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors.map(major => (
                        <SelectItem key={major.id} value={major.id}>
                          {major.name} ({major.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select value={formData.academicYear} onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                        <SelectItem value="2026-2027">2026-2027</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shift">Shift</Label>
                    <Select value={formData.shift} onValueChange={(value: ClassShift) => setFormData(prev => ({ ...prev, shift: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="homeroomTeacher">Homeroom Teacher</Label>
                  <Select value={formData.homeroomTeacherId} onValueChange={(value) => setFormData(prev => ({ ...prev, homeroomTeacherId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select homeroom teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(user => user.roles.includes("Lecturer")).map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="classStatus">Status</Label>
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
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClass} disabled={!formData.code.trim() || !formData.name.trim() || !formData.majorId}>
                    Create Class
                  </Button>
                </div>
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
              {Array.from(new Set(majors.map(m => m.departmentId))).map(deptId => {
                const dept = majors.find(m => m.departmentId === deptId)?.department;
                return dept ? (
                  <SelectItem key={deptId} value={deptId}>{dept.name}</SelectItem>
                ) : null;
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
                <SelectItem key={major.id} value={major.id}>{major.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {getUniqueValues("academicYear").map((year: string) => (
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
                          <DropdownMenuItem onClick={() => openEditDialog(cls)}>
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
                <span>Current enrollment: {selectedClassForEnroll?.enrolled}/{selectedClassForEnroll?.capacity}</span>
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