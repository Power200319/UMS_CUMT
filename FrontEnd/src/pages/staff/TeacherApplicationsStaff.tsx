import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeacherApplication {
  id: number;
  full_name: string;
  email: string;
  degree: string;
  major: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  phone: string;
}

export default function TeacherApplicationsStaff() {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/lecturer/applications/');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewDetails = (applicationId: number) => {
    navigate(`/admin/teacher-applications/${applicationId}`);
  };

  const handleCreateContract = (teacherId: number) => {
    navigate(`/admin/teacher-contracts/new?teacher=${teacherId}`);
  };

  const handleCreateSchedule = (teacherId: number) => {
    navigate(`/admin/teacher-schedules/new?teacher=${teacherId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage teacher registration applications</p>
        </div>
        <Button onClick={() => navigate('/staff/teacher-contracts/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Status:</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Application List ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.full_name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.degree}</TableCell>
                  <TableCell>{app.major}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(app.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {app.status === 'approved' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateContract(app.id)}
                          >
                            Contract
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateSchedule(app.id)}
                          >
                            Schedule
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No applications found for the selected filter.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {applications.filter(app => app.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {applications.filter(app => app.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}