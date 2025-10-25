import { useState, useEffect } from "react";
import { Search, FileText, Download, BarChart3, PieChart, TrendingUp, Calendar, Filter, Eye, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Report = {
  id: string;
  title: string;
  type: "attendance" | "academic" | "enrollment" | "financial" | "custom";
  description: string;
  generatedBy: string;
  generatedAt: string;
  period: string;
  status: "completed" | "processing" | "failed";
  format: "pdf" | "excel" | "csv";
  size: string;
};

export default function StaffReport() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  // Mock reports data
  const mockReports: Report[] = [
    {
      id: "rep_1",
      title: "Monthly Attendance Report - October 2025",
      type: "attendance",
      description: "Comprehensive attendance report for all classes in October",
      generatedBy: "Dara Sok",
      generatedAt: "2025-10-25T10:00:00Z",
      period: "October 2025",
      status: "completed",
      format: "pdf",
      size: "2.3 MB",
    },
    {
      id: "rep_2",
      title: "Academic Performance Report - Semester 1",
      type: "academic",
      description: "Student academic performance analysis for semester 1",
      generatedBy: "Dara Sok",
      generatedAt: "2025-10-24T15:30:00Z",
      period: "Semester 1 2024-2025",
      status: "completed",
      format: "excel",
      size: "1.8 MB",
    },
    {
      id: "rep_3",
      title: "Enrollment Statistics Report",
      type: "enrollment",
      description: "Student enrollment statistics by major and department",
      generatedBy: "Dara Sok",
      generatedAt: "2025-10-24T09:15:00Z",
      period: "Academic Year 2024-2025",
      status: "processing",
      format: "pdf",
      size: "Processing...",
    },
    {
      id: "rep_4",
      title: "Financial Summary Report",
      type: "financial",
      description: "Tuition and fee collection summary",
      generatedBy: "Dara Sok",
      generatedAt: "2025-10-23T14:20:00Z",
      period: "September 2025",
      status: "failed",
      format: "excel",
      size: "Error",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 600);
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "academic":
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case "enrollment":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case "financial":
        return <FileText className="h-4 w-4 text-yellow-500" />;
      case "custom":
        return <PieChart className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      attendance: "default",
      academic: "secondary",
      enrollment: "outline",
      financial: "secondary",
      custom: "outline",
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || "secondary"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      processing: "secondary",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getReportStats = () => {
    const total = reports.length;
    const completed = reports.filter(r => r.status === "completed").length;
    const processing = reports.filter(r => r.status === "processing").length;
    const failed = reports.filter(r => r.status === "failed").length;

    return { total, completed, processing, failed };
  };

  const stats = getReportStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading reports..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Generate and manage various reports and analytics"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff" },
          { label: "Reports" },
        ]}
        actions={
          <div className="flex gap-2">
            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Generate New Report</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="standard" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="standard">Standard Reports</TabsTrigger>
                    <TabsTrigger value="custom">Custom Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="standard" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attendance">Attendance Report</SelectItem>
                          <SelectItem value="academic">Academic Performance</SelectItem>
                          <SelectItem value="enrollment">Enrollment Statistics</SelectItem>
                          <SelectItem value="financial">Financial Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time Period</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="semester">Semester</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Format</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="custom" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Report Title</label>
                      <Input placeholder="Enter report title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input placeholder="Enter report description" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Data Sources</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="attendance" />
                          <label htmlFor="attendance" className="text-sm">Attendance Data</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="academic" />
                          <label htmlFor="academic" className="text-sm">Academic Records</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="enrollment" />
                          <label htmlFor="enrollment" className="text-sm">Enrollment Data</label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-2">
                  <Button className="flex-1">Generate Report</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        }
      />

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by report title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="enrollment">Enrollment</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports Table */}
      {filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description="Try adjusting your search criteria or generate a new report"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-muted-foreground">by {report.generatedBy}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(report.type)}
                      {getTypeBadge(report.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{report.period}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(report.generatedAt).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.size}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {report.status === "completed" && (
                          <>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download {report.format.toUpperCase()}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview Report
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {report.status === "failed" && (
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry Generation
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Report
                        </DropdownMenuItem>
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