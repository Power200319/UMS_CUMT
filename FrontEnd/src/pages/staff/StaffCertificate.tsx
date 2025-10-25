import { useState, useEffect } from "react";
import { Search, Award, Download, Upload, Eye, FileText, Calendar, User } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockUsers } from "@/api/mockData";
import type { User as UserType } from "@/types";

type Certificate = {
  id: string;
  studentId: string;
  student: UserType;
  type: "graduation" | "completion" | "achievement" | "enrollment";
  title: string;
  description: string;
  issueDate: string;
  graduationDate?: string;
  gpa?: number;
  major?: string;
  status: "issued" | "pending" | "draft";
  template: string;
};

export default function StaffCertificate() {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  // Mock certificates data
  const mockCertificates: Certificate[] = [
    {
      id: "cert_1",
      studentId: "u_3",
      student: mockUsers[2],
      type: "graduation",
      title: "Bachelor of Science in Computer Science",
      description: "Graduation certificate for completing the Computer Science program",
      issueDate: "2025-06-15",
      graduationDate: "2025-05-30",
      gpa: 3.8,
      major: "Computer Science",
      status: "issued",
      template: "graduation_template_1",
    },
    {
      id: "cert_2",
      studentId: "u_3",
      student: mockUsers[2],
      type: "completion",
      title: "Course Completion Certificate",
      description: "Certificate for completing Data Structures course",
      issueDate: "2025-01-15",
      status: "issued",
      template: "completion_template_1",
    },
    {
      id: "cert_3",
      studentId: "u_3",
      student: mockUsers[2],
      type: "achievement",
      title: "Dean's List Certificate",
      description: "Certificate for achieving Dean's List honors",
      issueDate: "2024-12-20",
      status: "pending",
      template: "achievement_template_1",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCertificates(mockCertificates);
      setLoading(false);
    }, 600);
  }, []);

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || cert.type === typeFilter;
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "graduation":
        return <Award className="h-4 w-4 text-purple-500" />;
      case "completion":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "achievement":
        return <Award className="h-4 w-4 text-yellow-500" />;
      case "enrollment":
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      graduation: "default",
      completion: "secondary",
      achievement: "outline",
      enrollment: "secondary",
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || "secondary"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      issued: "default",
      pending: "secondary",
      draft: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCertificateStats = () => {
    const total = certificates.length;
    const issued = certificates.filter(c => c.status === "issued").length;
    const pending = certificates.filter(c => c.status === "pending").length;
    const draft = certificates.filter(c => c.status === "draft").length;

    return { total, issued, pending, draft };
  };

  const stats = getCertificateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading certificates..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Certificate Management"
        description="Generate and manage student certificates"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff" },
          { label: "Certificates" },
        ]}
        actions={
          <div className="flex gap-2">
            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Award className="mr-2 h-4 w-4" />
                  Generate Certificate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New Certificate</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Certificate Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select certificate type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduation">Graduation Certificate</SelectItem>
                        <SelectItem value="completion">Course Completion</SelectItem>
                        <SelectItem value="achievement">Achievement Certificate</SelectItem>
                        <SelectItem value="enrollment">Enrollment Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Select Student</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.filter(u => u.roles.includes("Student")).map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Template</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduation_template_1">Graduation Template 1</SelectItem>
                        <SelectItem value="completion_template_1">Completion Template 1</SelectItem>
                        <SelectItem value="achievement_template_1">Achievement Template 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Generate Certificate</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Generate
            </Button>
          </div>
        }
      />

      {/* Certificate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issued</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.issued}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name or certificate title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Certificate Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="graduation">Graduation</SelectItem>
              <SelectItem value="completion">Completion</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="enrollment">Enrollment</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Certificates Table */}
      {filteredCertificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates found"
          description="Try adjusting your search criteria or generate a new certificate"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertificates.map((cert) => (
                <TableRow key={cert.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={cert.student.avatar} />
                        <AvatarFallback>
                          {cert.student.firstName[0]}{cert.student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{cert.student.firstName} {cert.student.lastName}</p>
                        <p className="text-sm text-muted-foreground">{cert.student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cert.title}</p>
                      <p className="text-sm text-muted-foreground">{cert.description}</p>
                      {cert.gpa && (
                        <p className="text-sm text-muted-foreground">GPA: {cert.gpa}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(cert.type)}
                      {getTypeBadge(cert.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(cert.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        {cert.status === "pending" && (
                          <DropdownMenuItem>
                            <Award className="mr-2 h-4 w-4" />
                            Issue Certificate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}