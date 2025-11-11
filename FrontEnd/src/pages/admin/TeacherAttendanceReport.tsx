import { useState, useEffect } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AttendanceRecord {
  teacher_name: string;
  subject: string;
  date: string;
  checkin: string | null;
  checkout: string | null;
  duration: string | null;
  status: 'present' | 'late' | 'absent';
}

export default function TeacherAttendanceReport() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAttendanceReport();
  }, []);

  const fetchAttendanceReport = async () => {
    try {
      const response = await fetch('/api/lecturer/attendance-report/');
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-500">Present</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-500">Late</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDuration = (duration: string | null) => {
    if (!duration) return 'N/A';
    // Assuming duration comes as HH:MM:SS format
    return duration;
  };

  const exportReport = () => {
    // In a real implementation, this would generate and download a CSV/PDF
    alert('Export functionality would be implemented here');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teacher Attendance Report</h1>
        <Button onClick={exportReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attendance Records
            </CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check-In</TableHead>
                <TableHead>Check-Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.teacher_name}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {record.checkin ? new Date(record.checkin).toLocaleTimeString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {record.checkout ? new Date(record.checkout).toLocaleTimeString() : 'N/A'}
                  </TableCell>
                  <TableCell>{formatDuration(record.duration)}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attendance records found.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {records.filter(r => r.status === 'present').length}
            </div>
            <p className="text-sm text-gray-600">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {records.filter(r => r.status === 'late').length}
            </div>
            <p className="text-sm text-gray-600">Late</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {records.filter(r => r.status === 'absent').length}
            </div>
            <p className="text-sm text-gray-600">Absent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}