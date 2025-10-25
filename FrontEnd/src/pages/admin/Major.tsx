import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, GraduationCap, Building2, Users, Upload, Download, FileText } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMajors, mockDepartments } from "@/api/mockData";
import type { Major, Department, AcademicLevel } from "@/types";

export default function Major() {
  const [loading, setLoading] = useState(true);
  const [majors, setMajors] = useState<Major[]>([]);
  const [departments] = useState<Department[]>(mockDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    departmentId: "",
    level: "Bachelor" as AcademicLevel,
    description: "",
    duration: 4,
    requiredCredits: 120,
    accreditation: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMajors(mockMajors);
      setLoading(false);
    }, 600);
  }, []);

  const filteredMajors = majors.filter((major) => {
    const matchesSearch =
      major.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      major.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || major.departmentId === departmentFilter;
    const matchesLevel = levelFilter === "all" || major.level === levelFilter;
    return matchesSearch && matchesDepartment && matchesLevel;
  });

  const handleCreateMajor = () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.departmentId) return;

    // Check for unique code
    if (majors.some(major => major.code === formData.code && major.id !== editingMajor?.id)) {
      alert("Major code must be unique");
      return;
    }

    const department = departments.find(d => d.id === formData.departmentId);
    if (!department) return;

    const newMajor: Major = {
      id: `maj_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      departmentId: formData.departmentId,
      department,
      level: formData.level,
      description: formData.description,
      duration: formData.duration,
      requiredCredits: formData.requiredCredits,
      accreditation: formData.accreditation,
      activeStudents: 0,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMajors(prev => [...prev, newMajor]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditMajor = () => {
    if (!editingMajor || !formData.name.trim() || !formData.code.trim() || !formData.departmentId) return;

    // Check for unique code
    if (majors.some(major => major.code === formData.code && major.id !== editingMajor.id)) {
      alert("Major code must be unique");
      return;
    }

    const department = departments.find(d => d.id === formData.departmentId);
    if (!department) return;

    const updatedMajor: Major = {
      ...editingMajor,
      name: formData.name,
      code: formData.code,
      departmentId: formData.departmentId,
      department,
      level: formData.level,
      description: formData.description,
      duration: formData.duration,
      requiredCredits: formData.requiredCredits,
      accreditation: formData.accreditation,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    setMajors(prev => prev.map(major =>
      major.id === editingMajor.id ? updatedMajor : major
    ));
    resetForm();
    setEditingMajor(null);
  };

  const handleDeleteMajor = (majorId: string) => {
    setMajors(prev => prev.filter(major => major.id !== majorId));
  };

  const handleBulkImport = (file: File) => {
    // Simulate CSV import
    console.log("Importing file:", file.name);
    // In real implementation, parse CSV and create majors
    setIsBulkImportOpen(false);
  };

  const downloadSampleCSV = () => {
    const csvContent = "name,code,department_code,level,description,duration,required_credits,accreditation\n" +
      "Computer Science,CS,CS,Bachelor,Computer Science program,4,120,ABET\n" +
      "Data Science,DS,CS,Bachelor,Data Science and Analytics,4,120,ABET";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'major_import_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      departmentId: "",
      level: "Bachelor",
      description: "",
      duration: 4,
      requiredCredits: 120,
      accreditation: "",
      status: "active",
    });
  };

  const openEditDialog = (major: Major) => {
    setEditingMajor(major);
    setFormData({
      name: major.name,
      code: major.code,
      departmentId: major.departmentId,
      level: major.level,
      description: major.description || "",
      duration: major.duration,
      requiredCredits: major.requiredCredits,
      accreditation: major.accreditation || "",
      status: major.status,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading majors..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Major Management"
        description="Manage academic programs and majors"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Majors" },
        ]}
        actions={
          <div className="flex gap-2">
            <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Import Majors</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>CSV File</Label>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBulkImport(file);
                      }}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a CSV file with major data. Download the sample file to see the required format.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={downloadSampleCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Sample CSV
                    </Button>
                  </div>
                  <div className="border rounded p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• name: Major name (required)</li>
                      <li>• code: Unique major code (required)</li>
                      <li>• department_code: Department code (required)</li>
                      <li>• level: Bachelor/Master/Doctorate (required)</li>
                      <li>• description: Major description (optional)</li>
                      <li>• duration: Duration in years (optional, default: 4)</li>
                      <li>• required_credits: Required credits (optional, default: 120)</li>
                      <li>• accreditation: Accreditation body (optional)</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Major
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Major</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label htmlFor="majorName">Major Name *</Label>
                      <Input
                        id="majorName"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter major name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="majorCode">Major Code *</Label>
                      <Input
                        id="majorCode"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="Enter major code (e.g., CS, SE)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.departmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="level">Academic Level *</Label>
                      <Select value={formData.level} onValueChange={(value: AcademicLevel) => setFormData(prev => ({ ...prev, level: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelor">Bachelor</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                          <SelectItem value="Doctorate">Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="majorDescription">Description</Label>
                      <Textarea
                        id="majorDescription"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter major description"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <Label htmlFor="duration">Duration (years)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 4 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="requiredCredits">Required Credits</Label>
                      <Input
                        id="requiredCredits"
                        type="number"
                        min="1"
                        value={formData.requiredCredits}
                        onChange={(e) => setFormData(prev => ({ ...prev, requiredCredits: parseInt(e.target.value) || 120 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="accreditation">Accreditation</Label>
                      <Input
                        id="accreditation"
                        value={formData.accreditation}
                        onChange={(e) => setFormData(prev => ({ ...prev, accreditation: e.target.value }))}
                        placeholder="e.g., ABET, AACSB"
                      />
                    </div>
                    <div>
                      <Label htmlFor="majorStatus">Status</Label>
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
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMajor} disabled={!formData.name.trim() || !formData.code.trim() || !formData.departmentId}>
                    Create Major
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Building2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <GraduationCap className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Bachelor">Bachelor</SelectItem>
            <SelectItem value="Master">Master</SelectItem>
            <SelectItem value="Doctorate">Doctorate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Majors Table */}
      {filteredMajors.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No majors found"
          description="Try adjusting your search criteria or create a new major"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Major</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Active Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMajors.map((major) => (
                <TableRow key={major.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{major.name}</p>
                      {major.description && (
                        <p className="text-sm text-muted-foreground">{major.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{major.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{major.department.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{major.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{major.activeStudents}</span>
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
                        <DropdownMenuItem onClick={() => openEditDialog(major)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
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
                              <AlertDialogTitle>Delete Major</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{major.name}"? This action cannot be undone and will affect all associated classes and students.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMajor(major.id)}>
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
    </div>
  );
}