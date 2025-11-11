import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Edit, Eye, Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Schedule {
  id: number;
  teacher_name: string;
  subject: string;
  class_name: string;
  room: string;
  date: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  qr_code_token: string;
}

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      // In a real implementation, this would fetch from API
      const mockSchedules: Schedule[] = [
        {
          id: 1,
          teacher_name: "Dr. Smith",
          subject: "Computer Science",
          class_name: "CS101",
          room: "Room 101",
          date: "2024-01-16",
          start_time: "08:00",
          end_time: "09:30",
          is_active: false,
          qr_code_token: "abc123"
        },
        {
          id: 2,
          teacher_name: "Prof. Johnson",
          subject: "Mathematics",
          class_name: "MATH201",
          room: "Room 203",
          date: "2024-01-16",
          start_time: "10:00",
          end_time: "11:30",
          is_active: true,
          qr_code_token: "def456"
        }
      ];
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesDate = !filterDate || schedule.date === filterDate;
    const matchesClass = filterClass === 'all' || schedule.class_name === filterClass;
    return matchesDate && matchesClass;
  });

  const uniqueClasses = [...new Set(schedules.map(s => s.class_name))];
  const todaySchedules = schedules.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const activeSchedules = schedules.filter(s => s.is_active);

  const handleViewDetails = (scheduleId: number) => {
    navigate(`/staff/schedules/${scheduleId}`);
  };

  const handleEditSchedule = (scheduleId: number) => {
    navigate(`/staff/schedules/${scheduleId}/edit`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading schedules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-gray-600 mt-1">Manage class schedules and QR code generation</p>
        </div>
        <Button onClick={() => navigate('/admin/teacher-schedules/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{schedules.length}</p>
              <p className="text-sm text-gray-600">Total Schedules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{todaySchedules.length}</p>
              <p className="text-sm text-gray-600">Today's Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{activeSchedules.length}</p>
              <p className="text-sm text-gray-600">Active Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{uniqueClasses.length}</p>
              <p className="text-sm text-gray-600">Active Classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                title="Select date"
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setFilterDate('');
                setFilterClass('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Class Schedules ({filteredSchedules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.teacher_name}</TableCell>
                  <TableCell>{schedule.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{schedule.class_name}</Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {schedule.room}
                  </TableCell>
                  <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {schedule.start_time} - {schedule.end_time}
                  </TableCell>
                  <TableCell>
                    <Badge variant={schedule.is_active ? "default" : "secondary"}>
                      {schedule.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(schedule.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSchedule(schedule.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSchedules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No schedules found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Schedule Highlight */}
      {todaySchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{schedule.subject}</h3>
                    <Badge variant={schedule.is_active ? "default" : "secondary"}>
                      {schedule.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {schedule.teacher_name}
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {schedule.room} • {schedule.class_name}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {schedule.start_time} - {schedule.end_time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}