import { useState, useEffect } from "react";
import { Eye, Users, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface ActiveSession {
  id: number;
  teacher_name: string;
  subject: string;
  class_name: string;
  room: string;
  start_time: string;
  end_time: string;
  teacher_checked_in: boolean;
  teacher_checkin_time: string | null;
  students_checked_in: number;
  total_students: number;
  late_students: number;
}

interface AttendanceRecord {
  id: number;
  student_name: string;
  checkin_time: string | null;
  status: 'present' | 'late' | 'absent';
}

export default function AttendanceMonitor() {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [sessionDetails, setSessionDetails] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      // Mock data for active sessions
      const mockSessions: ActiveSession[] = [
        {
          id: 1,
          teacher_name: "Dr. Smith",
          subject: "Computer Science",
          class_name: "CS101",
          room: "Room 101",
          start_time: "08:00",
          end_time: "09:30",
          teacher_checked_in: true,
          teacher_checkin_time: "07:55",
          students_checked_in: 25,
          total_students: 30,
          late_students: 3
        },
        {
          id: 2,
          teacher_name: "Prof. Johnson",
          subject: "Mathematics",
          class_name: "MATH201",
          room: "Room 203",
          start_time: "10:00",
          end_time: "11:30",
          teacher_checked_in: false,
          teacher_checkin_time: null,
          students_checked_in: 0,
          total_students: 28,
          late_students: 0
        }
      ];
      setActiveSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId: number) => {
    try {
      // Mock detailed attendance for selected session
      const mockDetails: AttendanceRecord[] = [
        { id: 1, student_name: "John Doe", checkin_time: "08:02", status: "late" },
        { id: 2, student_name: "Jane Smith", checkin_time: "07:58", status: "present" },
        { id: 3, student_name: "Bob Johnson", checkin_time: null, status: "absent" }
      ];
      setSessionDetails(mockDetails);
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  const handleViewSession = (session: ActiveSession) => {
    setSelectedSession(session);
    fetchSessionDetails(session.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Present</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Late</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading attendance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance Monitor</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of class attendance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{activeSessions.length}</p>
              <p className="text-sm text-gray-600">Active Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {activeSessions.filter(s => s.teacher_checked_in).length}
              </p>
              <p className="text-sm text-gray-600">Teachers Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {activeSessions.reduce((sum, s) => sum + s.students_checked_in, 0)}
              </p>
              <p className="text-sm text-gray-600">Students Checked In</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {activeSessions.reduce((sum, s) => sum + s.late_students, 0)}
              </p>
              <p className="text-sm text-gray-600">Late Arrivals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Class Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Teacher Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.teacher_name}</TableCell>
                  <TableCell>{session.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{session.class_name}</Badge>
                  </TableCell>
                  <TableCell>{session.room}</TableCell>
                  <TableCell>{session.start_time} - {session.end_time}</TableCell>
                  <TableCell>
                    {session.teacher_checked_in ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Present
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Waiting
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{session.students_checked_in}</span>
                      <span className="text-gray-500">/{session.total_students}</span>
                      {session.late_students > 0 && (
                        <span className="text-orange-600 ml-1">({session.late_students} late)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-20">
                      <Progress
                        value={(session.students_checked_in / session.total_students) * 100}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSession(session)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {activeSessions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active sessions at the moment.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Details */}
      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle>
              Session Details: {selectedSession.subject} - {selectedSession.class_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{selectedSession.students_checked_in}</p>
                <p className="text-sm text-gray-600">Checked In</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{selectedSession.late_students}</p>
                <p className="text-sm text-gray-600">Late</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {selectedSession.total_students - selectedSession.students_checked_in}
                </p>
                <p className="text-sm text-gray-600">Absent</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionDetails.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.student_name}</TableCell>
                    <TableCell>
                      {record.checkin_time ? new Date(`2024-01-01T${record.checkin_time}`).toLocaleTimeString() : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}