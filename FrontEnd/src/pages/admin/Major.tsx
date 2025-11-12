import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, GraduationCap, Building2, Upload, Download, FileText, User } from "lucide-react";
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
  DialogDescription,
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
import { API_ENDPOINTS, get, post, put, del } from "@/api/config";
import type { Major, Department, TeacherProfile } from "@/types";

export default function Major() {
  const [loading, setLoading] = useState(true);
  const [majors, setMajors] = useState<Major[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [viewingMajor, setViewingMajor] = useState<Major | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    description: "",
    duration_years: 4,
    degree_type: "Bachelor",
    is_active: true,
    department_head: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [majorsRes, departmentsRes, teachersRes] = await Promise.all([
          get(API_ENDPOINTS.ADMIN.MAJORS),
          get(API_ENDPOINTS.ADMIN.DEPARTMENTS),
          get(API_ENDPOINTS.LECTURER.TEACHER_PROFILES),
        ]);
        setMajors(majorsRes.results || majorsRes);
        setDepartments(departmentsRes.results || departmentsRes);
        setTeacherProfiles(teachersRes.results || teachersRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setMajors([]);
        setDepartments([]);
        setTeacherProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMajors = majors.filter((major) => {
    const matchesSearch =
      major.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      major.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || major.department === parseInt(departmentFilter);
    return matchesSearch && matchesDepartment;
  });

  const handleCreateMajor = async () => {
    if (!formData.name.trim() || !formData.code.trim() || !formData.department) return;

    try {
      const newMajor = await post(API_ENDPOINTS.ADMIN.MAJORS, {
        name: formData.name,
        code: formData.code,
        department: parseInt(formData.department),
        description: formData.description,
        duration_years: formData.duration_years,
        degree_type: formData.degree_type,
        is_active: formData.is_active,
        department_head: formData.department_head && formData.department_head !== "none" ? parseInt(formData.department_head) : null,
      });
      setMajors(prev => [...prev, newMajor]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating major:', error);
    }
  };

  const handleEditMajor = async () => {
    if (!editingMajor || !formData.name.trim() || !formData.code.trim() || !formData.department) return;

    try {
      const updatedMajor = await put(`${API_ENDPOINTS.ADMIN.MAJORS}${editingMajor.id}/`, {
        name: formData.name,
        code: formData.code,
        department: parseInt(formData.department),
        description: formData.description,
        duration_years: formData.duration_years,
        degree_type: formData.degree_type,
        is_active: formData.is_active,
        department_head: formData.department_head && formData.department_head !== "none" ? parseInt(formData.department_head) : null,
      });
      setMajors(prev => prev.map(major =>
        major.id === editingMajor.id ? updatedMajor : major
      ));
      resetForm();
      setEditingMajor(null);
      setIsEditDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error updating major:', error);
    }
  };

  const handleDeleteMajor = async (majorId: number) => {
    try {
      await del(`${API_ENDPOINTS.ADMIN.MAJORS}${majorId}/`);
      setMajors(prev => prev.filter(major => major.id !== majorId));
    } catch (error) {
      console.error('Error deleting major:', error);
    }
  };

  const handleBulkImport = (file: File) => {
    // Simulate CSV import
    console.log("Importing file:", file.name);
    // In real implementation, parse CSV and create majors
    setIsBulkImportOpen(false);
  };

  const downloadSampleCSV = () => {
    const csvContent = "name,code,department_code,description,duration\n" +
      "Computer Science,CS,CS,Computer Science program,4\n" +
      "Data Science,DS,CS,Data Science and Analytics,4";
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
      department: "",
      description: "",
      duration_years: 4,
      degree_type: "Bachelor",
      is_active: true,
      department_head: "",
    });
  };

  const openEditDialog = (major: Major) => {
    setEditingMajor(major);
    setIsEditDialogOpen(true);
    setFormData({
      name: major.name,
      code: major.code,
      department: major.department.toString(),
      description: major.description || "",
      duration_years: major.duration_years,
      degree_type: major.degree_type,
      is_active: major.is_active,
      department_head: major.department_head?.toString() || "none",
    });
  };

  const openViewDialog = (major: Major) => {
    setViewingMajor(major);
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
                      <li>• description: Major description (optional)</li>
                      <li>• duration: Duration in years (optional, default: 4)</li>
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
                  <DialogDescription>Add a new major to the system.</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                   <TabsList className="grid w-full grid-cols-1">
                     <TabsTrigger value="basic">Basic Info</TabsTrigger>
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
                      <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="degreeType">Degree Type</Label>
                      <Select value={formData.degree_type} onValueChange={(value) => setFormData(prev => ({ ...prev, degree_type: value }))}>
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
                      <Label htmlFor="duration">Duration (years)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.duration_years}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_years: parseInt(e.target.value) || 4 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="departmentHead">Department Head</Label>
                      <Select value={formData.department_head} onValueChange={(value) => setFormData(prev => ({ ...prev, department_head: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department head" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {teacherProfiles.map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                              {teacher.full_name}
                            </SelectItem>
                          ))}
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
                </Tabs>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMajor} disabled={!formData.name.trim() || !formData.code.trim() || !formData.department}>
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
              <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
            ))}
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
                      <span className="text-sm">
                        {departments.find(d => d.id === major.department)?.name || `Department ${major.department}`}
                      </span>
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
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              openEditDialog(major);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                  <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <DialogTitle className="text-xl font-semibold">Edit Major</DialogTitle>
                                  <DialogDescription className="text-muted-foreground">
                                    Update major information and settings
                                  </DialogDescription>
                                </div>
                              </div>
                            </DialogHeader>

                            <div className="mt-6">
                              <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                                  <TabsTrigger value="basic" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Basic Info
                                  </TabsTrigger>
                                  <TabsTrigger value="advanced" className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Advanced
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="space-y-6 mt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <Label htmlFor="editMajorName" className="text-sm font-medium text-foreground">
                                        Major Name *
                                      </Label>
                                      <Input
                                        id="editMajorName"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter major name"
                                        className="h-11 border-2 focus:border-blue-500 transition-colors"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="editMajorCode" className="text-sm font-medium text-foreground">
                                        Major Code *
                                      </Label>
                                      <Input
                                        id="editMajorCode"
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                        placeholder="e.g., CS, SE, IT"
                                        className="h-11 border-2 focus:border-blue-500 transition-colors font-mono"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="editDepartment" className="text-sm font-medium text-foreground">
                                      Department *
                                    </Label>
                                    <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                                      <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                                        <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {departments.map(dept => (
                                          <SelectItem key={dept.id} value={dept.id.toString()}>
                                            <div className="flex items-center gap-2">
                                              <Building2 className="h-4 w-4 text-muted-foreground" />
                                              {dept.name} ({dept.code})
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="editMajorDescription" className="text-sm font-medium text-foreground">
                                      Description
                                    </Label>
                                    <Textarea
                                      id="editMajorDescription"
                                      value={formData.description}
                                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                      placeholder="Enter major description..."
                                      className="min-h-[100px] border-2 focus:border-blue-500 transition-colors resize-none"
                                    />
                                  </div>
                                </TabsContent>

                                <TabsContent value="advanced" className="space-y-6 mt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <Label htmlFor="editDegreeType" className="text-sm font-medium text-foreground">
                                        Degree Type
                                      </Label>
                                      <Select value={formData.degree_type} onValueChange={(value) => setFormData(prev => ({ ...prev, degree_type: value }))}>
                                        <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Bachelor">
                                            <div className="flex items-center gap-2">
                                              <GraduationCap className="h-4 w-4 text-blue-500" />
                                              Bachelor
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="Master">
                                            <div className="flex items-center gap-2">
                                              <GraduationCap className="h-4 w-4 text-green-500" />
                                              Master
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="Doctorate">
                                            <div className="flex items-center gap-2">
                                              <GraduationCap className="h-4 w-4 text-purple-500" />
                                              Doctorate
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="editDuration" className="text-sm font-medium text-foreground">
                                        Duration (years)
                                      </Label>
                                      <Input
                                        id="editDuration"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.duration_years}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration_years: parseInt(e.target.value) || 4 }))}
                                        className="h-11 border-2 focus:border-blue-500 transition-colors"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="editDepartmentHead" className="text-sm font-medium text-foreground">
                                      Department Head
                                    </Label>
                                    <Select value={formData.department_head} onValueChange={(value) => setFormData(prev => ({ ...prev, department_head: value }))}>
                                      <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                                        <SelectValue placeholder="Select department head" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            None
                                          </div>
                                        </SelectItem>
                                        {teacherProfiles.map(teacher => (
                                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                            <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-blue-500" />
                                              {teacher.full_name}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="editMajorStatus" className="text-sm font-medium text-foreground">
                                      Status
                                    </Label>
                                    <Select value={formData.is_active ? "active" : "inactive"} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, is_active: value === "active" }))}>
                                      <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Active
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            Inactive
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  resetForm();
                                  setEditingMajor(null);
                                  setIsEditDialogOpen(false);
                                }}
                                className="px-6 h-11 border-2 hover:bg-muted/50 transition-colors"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleEditMajor}
                                disabled={!formData.name.trim() || !formData.code.trim() || !formData.department}
                                className="px-6 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Update Major
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              openViewDialog(major);
                            }}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Major Details</DialogTitle>
                              <DialogDescription>Detailed information about the major.</DialogDescription>
                            </DialogHeader>
                            {viewingMajor && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Major Name</Label>
                                  <p className="text-sm font-medium">{viewingMajor.name}</p>
                                </div>
                                <div>
                                  <Label>Major Code</Label>
                                  <p className="text-sm font-medium">{viewingMajor.code}</p>
                                </div>
                                <div>
                                  <Label>Department</Label>
                                  <p className="text-sm font-medium">
                                    {departments.find(d => d.id === viewingMajor.department)?.name || `Department ${viewingMajor.department}`}
                                  </p>
                                </div>
                                <div>
                                  <Label>Degree Type</Label>
                                  <p className="text-sm font-medium">{viewingMajor.degree_type}</p>
                                </div>
                                <div>
                                  <Label>Duration</Label>
                                  <p className="text-sm font-medium">{viewingMajor.duration_years} years</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge variant={viewingMajor.is_active ? "default" : "secondary"}>
                                    {viewingMajor.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                {viewingMajor.description && (
                                  <div>
                                    <Label>Description</Label>
                                    <p className="text-sm">{viewingMajor.description}</p>
                                  </div>
                                )}
                                {viewingMajor.department_head && (
                                  <div>
                                    <Label>Department Head</Label>
                                    <p className="text-sm font-medium">
                                      {teacherProfiles.find(t => t.id === viewingMajor.department_head)?.full_name || `Teacher ${viewingMajor.department_head}`}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
                              <AlertDialogAction onClick={() => handleDeleteMajor(major.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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