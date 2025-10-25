import { useState, useEffect } from "react";
import { Clock, MapPin, LogIn, LogOut, Calendar, Timer, CheckCircle, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockLecturerAttendance } from "@/api/mockData";
import { useResponsive } from "@/hooks/useResponsive";
import type { User } from "@/types";

type AttendanceStatus = "checked_in" | "completed" | "absent";

interface AttendanceRecord {
  id: string;
  lecturerId: string;
  lecturer: User;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  location: string;
  notes: string;
  totalHours: number | null;
  createdAt: string;
}

export default function CheckInOut() {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentSession, setCurrentSession] = useState<AttendanceRecord | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const records = mockLecturerAttendance as AttendanceRecord[];
      setAttendanceRecords(records);

      // Check if there's an active session (checked in but not checked out)
      const activeSession = records.find(record => record.status === "checked_in");
      setCurrentSession(activeSession || null);

      setLoading(false);
    }, 800);
  }, []);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);

    // Simulate API call
    setTimeout(() => {
      const newRecord: AttendanceRecord = {
        id: `lec_att_${Date.now()}`,
        lecturerId: "u_2",
        lecturer: {
          id: "u_2",
          firstName: "Dara",
          lastName: "Sok",
          email: "dara.sok@example.edu",
          phone: "+855-12-345-679",
          roles: ["Lecturer"],
          department: "Computer Science",
          departmentId: "dept_2",
          status: "active",
          lastLogin: "2025-10-23T14:20:00Z",
          createdAt: "2024-02-10T00:00:00Z",
          updatedAt: "2025-10-23T14:20:00Z",
        },
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date().toTimeString().slice(0, 5),
        checkOutTime: null,
        status: "checked_in",
        location: "Building A, Room 301",
        notes: notes,
        totalHours: null,
        createdAt: new Date().toISOString(),
      };

      setAttendanceRecords(prev => [newRecord, ...prev]);
      setCurrentSession(newRecord);
      setNotes("");
      setIsCheckingIn(false);
    }, 1000);
  };

  const handleCheckOut = async () => {
    if (!currentSession) return;

    setIsCheckingOut(true);

    // Simulate API call
    setTimeout(() => {
      const checkOutTime = new Date().toTimeString().slice(0, 5);
      const checkInTime = currentSession.checkInTime;
      const totalHours = checkInTime ? calculateHours(checkInTime, checkOutTime) : 0;

      const updatedRecord: AttendanceRecord = {
        ...currentSession,
        checkOutTime,
        status: "completed",
        notes: notes || currentSession.notes,
        totalHours,
      };

      setAttendanceRecords(prev =>
        prev.map(record =>
          record.id === currentSession.id ? updatedRecord : record
        )
      );
      setCurrentSession(null);
      setNotes("");
      setIsCheckingOut(false);
    }, 1000);
  };

  const calculateHours = (checkIn: string, checkOut: string): number => {
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);

    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;

    const diffMinutes = outTotalMinutes - inTotalMinutes;
    return Math.round((diffMinutes / 60) * 100) / 100; // Round to 2 decimal places
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "checked_in":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "checked_in":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "absent":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "--:--";
    return time;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading attendance..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Attendance"
        description="Check in and out for your teaching sessions"
        aria-label="Daily attendance page header"
      />

      {/* Current Session Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-blue-900">Checked In:</span>
                    <span className="text-blue-600">{formatTime(currentSession.checkInTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-600">{currentSession.location}</span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(currentSession.status)} flex items-center gap-1`}>
                  {getStatusIcon(currentSession.status)}
                  Active Session
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout-notes">Check-out Notes (Optional)</Label>
                <Textarea
                  id="checkout-notes"
                  placeholder="Add any notes for check-out..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <Button
                onClick={handleCheckOut}
                disabled={isCheckingOut}
                className="bg-blue-600 hover:bg-blue-700 w-full"
                aria-label="Check out from current session"
              >
                {isCheckingOut ? (
                  <>
                    <Loader size="sm" className="mr-2" aria-hidden="true" />
                    Checking Out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    Check Out
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-blue-900 mb-2">No Active Session</h3>
                <p className="text-blue-600 mb-4">You are currently checked out. Ready to start your day?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkin-notes">Check-in Notes (Optional)</Label>
                <Textarea
                  id="checkin-notes"
                  placeholder="Add any notes for check-in..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <Button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="bg-blue-600 hover:bg-blue-700 w-full"
                aria-label="Check in for new session"
              >
                {isCheckingIn ? (
                  <>
                    <Loader size="sm" className="mr-2" aria-hidden="true" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                    Check In
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 hover:bg-blue-50 transition-all duration-300 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <Badge className={`${getStatusColor(record.status)} flex items-center gap-1`}>
                      {getStatusIcon(record.status)}
                      {record.status === "checked_in" ? "Active" :
                       record.status === "completed" ? "Completed" : "Absent"}
                    </Badge>
                  </div>
                  {record.totalHours && (
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">
                        {record.totalHours} hours
                      </span>
                    </div>
                  )}
                </div>

                <div className={`grid gap-4 text-sm ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-blue-900">Check In</p>
                      <p className="text-blue-600">{formatTime(record.checkInTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-blue-900">Check Out</p>
                      <p className="text-blue-600">{formatTime(record.checkOutTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900">Location</p>
                      <p className="text-blue-600">{record.location}</p>
                    </div>
                  </div>
                </div>

                {record.notes && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Notes</p>
                      <p className="text-blue-600 text-sm">{record.notes}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {attendanceRecords.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">No Attendance Records</h3>
              <p className="text-blue-600">Your attendance history will appear here once you start checking in.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}