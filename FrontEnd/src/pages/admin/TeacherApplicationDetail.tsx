import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TeacherApplication {
  id: number;
  full_name: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  place_of_birth: string;
  degree: string;
  major: string;
  institution: string;
  phone: string;
  email: string;
  experience: string;
  photo: string;
  cv: string;
  certificate: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function TeacherApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<TeacherApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchApplicationDetail(parseInt(id));
    }
  }, [id]);

  const fetchApplicationDetail = async (applicationId: number) => {
    try {
      // For now, we'll simulate fetching from API
      // In real implementation, this would be: const response = await fetch(`/api/lecturer/applications/${applicationId}/`);
      const mockData: TeacherApplication = {
        id: applicationId,
        full_name: "John Doe",
        gender: "male",
        date_of_birth: "1985-05-15",
        nationality: "Cambodian",
        place_of_birth: "Phnom Penh",
        degree: "Master",
        major: "Computer Science",
        institution: "Royal University of Phnom Penh",
        phone: "+85512345678",
        email: "john.doe@example.com",
        experience: "5 years of teaching experience in software development and algorithms.",
        photo: "/placeholder.svg",
        cv: "/placeholder.pdf",
        certificate: "/placeholder.pdf",
        status: "pending",
        created_at: "2024-01-15T10:00:00Z"
      };
      setApplication(mockData);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!application) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/lecturer/applications/${application.id}/approve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('Application approved successfully!');
        navigate('/admin/teacher-applications');
      } else {
        alert('Failed to approve application.');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!application) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/lecturer/applications/${application.id}/reject/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('Application rejected.');
        navigate('/admin/teacher-applications');
      } else {
        alert('Failed to reject application.');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!application) {
    return <div className="text-center py-8">Application not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/teacher-applications')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
        <h1 className="text-3xl font-bold">Application Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg">{application.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-lg capitalize">{application.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-lg">{new Date(application.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nationality</label>
                  <p className="text-lg">{application.nationality}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Place of Birth</label>
                  <p className="text-lg">{application.place_of_birth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-lg">{application.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{application.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Degree</label>
                  <p className="text-lg">{application.degree}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Major</label>
                  <p className="text-lg">{application.major}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Institution</label>
                  <p className="text-lg">{application.institution}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teaching Experience</label>
                <p className="text-lg mt-1">{application.experience}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo</label>
                <div className="flex items-center gap-2">
                  <img src={application.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">CV</label>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Degree Certificate</label>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant={application.status === 'pending' ? 'secondary' : application.status === 'approved' ? 'default' : 'destructive'}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-600">
                  Applied: {new Date(application.created_at).toLocaleDateString()}
                </span>
              </div>
              {application.status === 'pending' && (
                <div className="space-y-2">
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}