import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, Calendar, Clock, MapPin, User, Filter, Download, Printer, AlertTriangle } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { mockMajors, mockUsers, mockDepartments } from "@/api/mockData";
import type { Schedule, Course, Class, User as UserType, DayOfWeek, Semester } from "@/types";

export default function Schedule() {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses] = useState<Course[]>([]);
  const [classes] = useState<Class[]>([]);
  const [users] = useState<UserType[]>(mockUsers);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [lecturerFilter, setLecturerFilter] = useState<string>("all");
  const [weekFilter, setWeekFilter] = useState<string>("current");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Mock schedules data
  const mockSchedules: Schedule[] = [
    {
      id: "schedule_1",
      courseId: "course_1",
      course: {
        id: "course_1",
        code: "CS101",
        title: "Introduction to Computer Science",
        description: "",
        credits: 3,
        departmentId: "dept_2",
        department: mockDepartments[1],
        semester: "1",
        prerequisites: [],
        prerequisiteIds: [],
        status: "active",
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
      },
      classId: "class_1",
      class: {
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
        status: "active",
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
      },
      lecturerId: "u_2",
      lecturer: mockUsers[1],
      room: "Room 301",
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      academicYear: "2024-2025",
      semester: "1",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    courseId: "",
    classId: "",
    lecturerId: "",
    room: "",
    dayOfWeek: "Monday" as DayOfWeek,
    startTime: "09:00",
    endTime: "10:30",
    academicYear: "2024-2025",
    semester: "1" as Semester,
    repeatPattern: "weekly" as "weekly" | "biweekly",
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSchedules(mockSchedules);
      setLoading(false);
    }, 600);
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || schedule.course.departmentId === departmentFilter;
    const matchesClass = classFilter === "all" || schedule.classId === classFilter;
    const matchesLecturer = lecturerFilter === "all" || schedule.lecturerId === lecturerFilter;
    return matchesSearch && matchesDepartment && matchesClass && matchesLecturer;
  });

  const handleCreateSchedule = () => {
    if (!formData.courseId || !formData.classId || !formData.lecturerId || !formData.room) return;

    // Check for conflicts
    const conflict = schedules.find(s =>
      s.dayOfWeek === formData.dayOfWeek &&
      s.room === formData.room &&
      ((s.startTime <= formData.startTime && s.endTime > formData.startTime) ||
       (s.startTime < formData.endTime && s.endTime >= formData.endTime))
    );

    if (conflict) {
      alert("Schedule conflict detected! Please choose a different time or room.");
      return;
    }

    const course = courses.find(c => c.id === formData.courseId);
    const cls = classes.find(c => c.id === formData.classId);
    const lecturer = users.find(u => u.id === formData.lecturerId);

    if (!course || !cls || !lecturer) return;

    const newSchedule: Schedule = {
      id: `schedule_${Date.now()}`,
      courseId: formData.courseId,
      course,
      classId: formData.classId,
      class: cls,
      lecturerId: formData.lecturerId,
      lecturer,
      room: formData.room,
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      academicYear: formData.academicYear,
      semester: formData.semester,
      repeatPattern: formData.repeatPattern,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSchedules(prev => [...prev, newSchedule]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditSchedule = () => {
    if (!editingSchedule || !formData.courseId || !formData.classId || !formData.lecturerId || !formData.room) return;

    const course = courses.find(c => c.id === formData.courseId);
    const cls = classes.find(c => c.id === formData.classId);
    const lecturer = users.find(u => u.id === formData.lecturerId);

    if (!course || !cls || !lecturer) return;

    const updatedSchedule: Schedule = {
      ...editingSchedule,
      courseId: formData.courseId,
      course,
      classId: formData.classId,
      class: cls,
      lecturerId: formData.lecturerId,
      lecturer,
      room: formData.room,
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      academicYear: formData.academicYear,
      semester: formData.semester,
      repeatPattern: formData.repeatPattern,
      updatedAt: new Date().toISOString(),
    };

    setSchedules(prev => prev.map(schedule =>
      schedule.id === editingSchedule.id ? updatedSchedule : schedule
    ));
    resetForm();
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  const resetForm = () => {
    setFormData({
      courseId: "",
      classId: "",
      lecturerId: "",
      room: "",
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      academicYear: "2024-2025",
      semester: "1",
      repeatPattern: "weekly",
    });
  };

  const openEditDialog = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      courseId: schedule.courseId,
      classId: schedule.classId,
      lecturerId: schedule.lecturerId,
      room: schedule.room,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      academicYear: schedule.academicYear,
      semester: schedule.semester,
      repeatPattern: schedule.repeatPattern || "weekly",
    });
  };

  const exportSchedule = (format: "pdf" | "csv") => {
    // Simulate export
    console.log(`Exporting schedule as ${format}`);
  };

  const getDaySchedule = (day: DayOfWeek) => {
    return filteredSchedules.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading schedules..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Schedule Management"
        description="Manage timetables and class scheduling"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Schedule" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportSchedule("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => exportSchedule("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Schedule</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course">Course *</Label>
                    <Select value={formData.courseId} onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="class">Class *</Label>
                    <Select value={formData.classId} onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(cls => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.code} - {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lecturer">Lecturer *</Label>
                    <Select value={formData.lecturerId} onValueChange={(value) => setFormData(prev => ({ ...prev, lecturerId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lecturer" />
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
                    <Label htmlFor="room">Room *</Label>
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                      placeholder="e.g., Room 301"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dayOfWeek">Day of Week</Label>
                    <Select value={formData.dayOfWeek} onValueChange={(value: DayOfWeek) => setFormData(prev => ({ ...prev, dayOfWeek: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select value={formData.academicYear} onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSchedule} disabled={!formData.courseId || !formData.classId || !formData.lecturerId || !formData.room}>
                    Create Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <Tabs value={viewMode} onValueChange={(value: "list" | "calendar") => setViewMode(value)}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by course, room..."
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
              {Array.from(new Set(schedules.map(s => s.course.departmentId))).map(deptId => {
                const dept = schedules.find(s => s.course.departmentId === deptId)?.course.department;
                return dept ? (
                  <SelectItem key={deptId} value={deptId}>{dept.name}</SelectItem>
                ) : null;
              })}
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {Array.from(new Set(schedules.map(s => s.classId))).map(classId => {
                const cls = schedules.find(s => s.classId === classId)?.class;
                return cls ? (
                  <SelectItem key={classId} value={classId}>{cls.code}</SelectItem>
                ) : null;
              })}
            </SelectContent>
          </Select>
          <Select value={lecturerFilter} onValueChange={setLecturerFilter}>
            <SelectTrigger className="w-40">
              <User className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Lecturer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lecturers</SelectItem>
              {Array.from(new Set(schedules.map(s => s.lecturerId))).map(lecturerId => {
                const lecturer = schedules.find(s => s.lecturerId === lecturerId)?.lecturer;
                return lecturer ? (
                  <SelectItem key={lecturerId} value={lecturerId}>
                    {lecturer.firstName} {lecturer.lastName}
                  </SelectItem>
                ) : null;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          {/* List View */}
          {filteredSchedules.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No schedules found"
              description="Try adjusting your search criteria or create a new schedule"
            />
          ) : (
            <div className="border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Lecturer</TableHead>
                    <TableHead>Day & Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{schedule.course.title}</p>
                          <p className="text-sm text-muted-foreground">{schedule.course.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{schedule.class.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={schedule.lecturer.avatar} />
                            <AvatarFallback className="text-xs">
                              {schedule.lecturer.firstName[0]}{schedule.lecturer.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{schedule.lecturer.firstName} {schedule.lecturer.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{schedule.dayOfWeek}</p>
                          <p className="text-muted-foreground">{schedule.startTime} - {schedule.endTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{schedule.room}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(schedule)}>
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
                                  <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this schedule? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteSchedule(schedule.id)}>
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
        </>
      ) : (
        <>
          {/* Calendar View */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as DayOfWeek[]).map((day) => {
              const daySchedules = getDaySchedule(day);
              return (
                <Card key={day}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {daySchedules.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No classes</p>
                      ) : (
                        daySchedules.map((schedule) => (
                          <div key={schedule.id} className="p-2 border rounded text-sm">
                            <p className="font-medium">{schedule.course.code}</p>
                            <p className="text-muted-foreground">{schedule.startTime} - {schedule.endTime}</p>
                            <p className="text-muted-foreground">{schedule.room}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}