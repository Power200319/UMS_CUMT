import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, Building2, Eye, FileText } from "lucide-react";
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { API_ENDPOINTS, get, post, put, del } from "@/api/config";
import type { Department, StaffProfile } from "@/types";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Department() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    is_active: true,
    head_of_department: "",
    building_location: "",
    contact_email: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await get(API_ENDPOINTS.ADMIN.DEPARTMENTS);
        setDepartments(response.results || response);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        setDepartments([]);
        // Don't set isLoggedIn to false on API error - assume user is logged in
        // and API just needs authentication token
      } finally {
        setLoading(false);
      }
    };

    const fetchStaffProfiles = async () => {
      try {
        // Use the staff profiles endpoint
        const response = await get(API_ENDPOINTS.STAFF.STAFF_PROFILES);
        console.log('Staff profiles response:', response);
        setStaffProfiles(response.results || response);
      } catch (error) {
        console.error('Failed to fetch staff profiles:', error);
        setStaffProfiles([]);
        // Don't set isLoggedIn to false on API error
      }
    };

    fetchDepartments();
    fetchStaffProfiles();
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const response = await get(API_ENDPOINTS.ADMIN.MAJORS);
      setMajors(response.results || response);
    } catch (error) {
      console.error('Failed to fetch majors:', error);
      setMajors([]);
    }
  };

  const filteredAndSortedDepartments = departments
    .filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const aValue = sortBy === "name" ? a.name : a.code;
      const bValue = sortBy === "name" ? b.name : b.code;
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleCreateDepartment = async () => {
    if (!formData.name.trim() || !formData.code.trim()) return;

    try {
      const newDepartment = await post(API_ENDPOINTS.ADMIN.DEPARTMENTS, {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        is_active: formData.is_active,
        head_of_department: formData.head_of_department && formData.head_of_department !== "none" ? parseInt(formData.head_of_department) : null,
        building_location: formData.building_location,
        contact_email: formData.contact_email,
      });
      setDepartments(prev => [...prev, newDepartment]);
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleEditDepartment = async () => {
    if (!editingDepartment || !formData.name.trim() || !formData.code.trim()) return;

    try {
      const updatedDepartment = await put(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}${editingDepartment.id}/`, {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        is_active: formData.is_active,
        head_of_department: formData.head_of_department && formData.head_of_department !== "none" ? parseInt(formData.head_of_department) : null,
        building_location: formData.building_location,
        contact_email: formData.contact_email,
      });
      setDepartments(prev => prev.map(dept =>
        dept.id === editingDepartment.id ? updatedDepartment : dept
      ));
      resetForm();
      setEditingDepartment(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    try {
      await del(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}${departmentId}/`);
      setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      is_active: true,
      head_of_department: "",
      building_location: "",
      contact_email: "",
    });
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || "",
      is_active: department.is_active,
      head_of_department: department.head_of_department?.toString() || "",
      building_location: department.building_location || "",
      contact_email: department.contact_email || "",
    });
    setIsEditDialogOpen(true);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading departments..." />
      </div>
    );
  }

  return (
    <div>
      {/* Remove the login warning since API errors don't mean user isn't logged in */}
      <PageHeader
        title="Department Management"
        description="Manage faculty departments and offices"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Departments" },
        ]}
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold">Create New Department</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Add a new faculty department to the system
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
                    <TabsTrigger value="contact" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Contact & Location
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="deptName" className="text-sm font-medium text-foreground">
                          Department Name *
                        </Label>
                        <Input
                          id="deptName"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter department name"
                          className="h-11 border-2 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deptCode" className="text-sm font-medium text-foreground">
                          Department Code *
                        </Label>
                        <Input
                          id="deptCode"
                          value={formData.code}
                          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          placeholder="e.g., CS, BA, ENG"
                          className="h-11 border-2 focus:border-purple-500 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deptDescription" className="text-sm font-medium text-foreground">
                        Description
                      </Label>
                      <Textarea
                        id="deptDescription"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter department description..."
                        className="min-h-[100px] border-2 focus:border-purple-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deptHead" className="text-sm font-medium text-foreground">
                        Head of Department
                      </Label>
                      <Select value={formData.head_of_department} onValueChange={(value) => setFormData(prev => ({ ...prev, head_of_department: value }))}>
                        <SelectTrigger className="h-11 border-2 focus:border-purple-500 transition-colors">
                          <SelectValue placeholder="Select head of department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-2 border-dashed border-muted-foreground"></div>
                              None
                            </div>
                          </SelectItem>
                          {staffProfiles.length > 0 ? (
                            staffProfiles.map((staff) => (
                              <SelectItem key={staff.id} value={staff.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={staff.photo} />
                                    <AvatarFallback className="text-xs">
                                      {staff.full_name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{staff.full_name}</div>
                                    <div className="text-xs text-muted-foreground">{staff.position}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-muted"></div>
                                No staff members available
                              </div>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deptStatus" className="text-sm font-medium text-foreground">
                        Status
                      </Label>
                      <Select value={formData.is_active ? "active" : "inactive"} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, is_active: value === "active" }))}>
                        <SelectTrigger className="h-11 border-2 focus:border-purple-500 transition-colors">
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

                  <TabsContent value="contact" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="deptBuilding" className="text-sm font-medium text-foreground">
                          Building Location
                        </Label>
                        <Input
                          id="deptBuilding"
                          value={formData.building_location}
                          onChange={(e) => setFormData(prev => ({ ...prev, building_location: e.target.value }))}
                          placeholder="e.g., Building A, Room 101"
                          className="h-11 border-2 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deptEmail" className="text-sm font-medium text-foreground">
                          Contact Email
                        </Label>
                        <Input
                          id="deptEmail"
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                          placeholder="contact@department.edu"
                          className="h-11 border-2 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-900 dark:text-purple-100">Department Setup Tips</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">Ensure all information is accurate for proper system integration</p>
                        </div>
                      </div>
                      <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                        <li>• Use unique department codes (e.g., CS for Computer Science)</li>
                        <li>• Building location helps with scheduling and navigation</li>
                        <li>• Contact email is used for official communications</li>
                        <li>• Head of department can be assigned later if needed</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  className="px-6 h-11 border-2 hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDepartment}
                  disabled={!formData.name.trim() || !formData.code.trim()}
                  className="px-6 h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Department
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
          const [field, order] = value.split('-') as ["name" | "code", "asc" | "desc"];
          setSortBy(field);
          setSortOrder(order);
        }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="code-asc">Code (A-Z)</SelectItem>
            <SelectItem value="code-desc">Code (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Departments Table */}
      {filteredAndSortedDepartments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="Try adjusting your search criteria or create a new department"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Majors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDepartments.map((department) => {
                const headUser = null; // No head of department field
                return (
                  <TableRow key={department.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{department.name}</p>
                        {department.description && (
                          <p className="text-sm text-muted-foreground">{department.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{department.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {department.head_of_department ?
                          staffProfiles.find(s => s.id === department.head_of_department)?.full_name || `Staff ID: ${department.head_of_department}`
                          : "Not assigned"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{majors.filter(m => m.department === department.id).length} majors</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={department.is_active ? "default" : "secondary"}>
                        {department.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Drawer>
                            <DrawerTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                setSelectedDepartment(department);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle>{selectedDepartment?.name} Details</DrawerTitle>
                              </DrawerHeader>
                              {selectedDepartment && (
                                <div className="p-6 space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Department Info</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <Label className="text-sm font-medium">Name</Label>
                                          <p>{selectedDepartment.name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Code</Label>
                                          <p>{selectedDepartment.code}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Description</Label>
                                          <p>{selectedDepartment.description || "No description"}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Head of Department</Label>
                                          <p>{selectedDepartment.head_of_department ?
                                            staffProfiles.find(s => s.id === selectedDepartment.head_of_department)?.full_name || `Staff ID: ${selectedDepartment.head_of_department}`
                                            : "Not assigned"}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Building Location</Label>
                                          <p>{selectedDepartment.building_location || "Not specified"}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Contact Email</Label>
                                          <p>{selectedDepartment.contact_email || "Not specified"}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Status</Label>
                                          <Badge variant={selectedDepartment.is_active ? "default" : "secondary"}>
                                            {selectedDepartment.is_active ? "Active" : "Inactive"}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>

                                  </div>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Majors ({majors.filter(m => m.department === selectedDepartment.id).length})</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {majors.filter(m => m.department === selectedDepartment.id).length > 0 ? (
                                        <div className="space-y-2">
                                          {majors.filter(m => m.department === selectedDepartment.id).map((major) => (
                                            <div key={major.id} className="flex items-center justify-between p-2 border rounded">
                                              <div>
                                                <p className="font-medium">{major.name}</p>
                                                <p className="text-sm text-muted-foreground">{major.code}</p>
                                              </div>
                                              <Badge variant={major.is_active ? "default" : "secondary"}>
                                                {major.is_active ? "Active" : "Inactive"}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                          No majors in this department
                                        </div>
                                      )}
                                      <div className="flex gap-2 mt-4">
                                        <Button variant="outline" className="flex-1">
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Major
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                          View All Majors
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DrawerContent>
                          </Drawer>
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                openEditDialog(department);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                    <Building2 className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-xl font-semibold">Edit Department</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                      Update department information and settings
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <div className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="editDeptName" className="text-sm font-medium text-foreground">
                                      Department Name *
                                    </Label>
                                    <Input
                                      id="editDeptName"
                                      value={formData.name}
                                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="Enter department name"
                                      className="h-11 border-2 focus:border-blue-500 transition-colors"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="editDeptCode" className="text-sm font-medium text-foreground">
                                      Department Code *
                                    </Label>
                                    <Input
                                      id="editDeptCode"
                                      value={formData.code}
                                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                      placeholder="e.g., CS, BA, ENG"
                                      className="h-11 border-2 focus:border-blue-500 transition-colors font-mono"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="editDeptDescription" className="text-sm font-medium text-foreground">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="editDeptDescription"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter department description..."
                                    className="min-h-[100px] border-2 focus:border-blue-500 transition-colors resize-none"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="editDeptBuilding" className="text-sm font-medium text-foreground">
                                      Building Location
                                    </Label>
                                    <Input
                                      id="editDeptBuilding"
                                      value={formData.building_location}
                                      onChange={(e) => setFormData(prev => ({ ...prev, building_location: e.target.value }))}
                                      placeholder="e.g., Building A, Room 101"
                                      className="h-11 border-2 focus:border-blue-500 transition-colors"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="editDeptEmail" className="text-sm font-medium text-foreground">
                                      Contact Email
                                    </Label>
                                    <Input
                                      id="editDeptEmail"
                                      type="email"
                                      value={formData.contact_email}
                                      onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                      placeholder="contact@department.edu"
                                      className="h-11 border-2 focus:border-blue-500 transition-colors"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="editDeptHead" className="text-sm font-medium text-foreground">
                                    Head of Department
                                  </Label>
                                  <Select value={formData.head_of_department} onValueChange={(value) => setFormData(prev => ({ ...prev, head_of_department: value }))}>
                                    <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                                      <SelectValue placeholder="Select head of department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 rounded-full border-2 border-dashed border-muted-foreground"></div>
                                          None
                                        </div>
                                      </SelectItem>
                                      {staffProfiles.length > 0 ? (
                                        staffProfiles.map((staff) => (
                                          <SelectItem key={staff.id} value={staff.id.toString()}>
                                            <div className="flex items-center gap-2">
                                              <Avatar className="h-6 w-6">
                                                <AvatarImage src={staff.photo} />
                                                <AvatarFallback className="text-xs">
                                                  {staff.full_name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <div className="font-medium">{staff.full_name}</div>
                                                <div className="text-xs text-muted-foreground">{staff.position}</div>
                                              </div>
                                            </div>
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="none" disabled>
                                          <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-muted"></div>
                                            No staff members available
                                          </div>
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="editDeptStatus" className="text-sm font-medium text-foreground">
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
                              </div>

                              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    resetForm();
                                    setEditingDepartment(null);
                                    setIsEditDialogOpen(false);
                                  }}
                                  className="px-6 h-11 border-2 hover:bg-muted/50 transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleEditDepartment}
                                  disabled={!formData.name.trim() || !formData.code.trim()}
                                  className="px-6 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Update Department
                                </Button>
                              </div>
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
                                <AlertDialogTitle>Delete Department</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{department.name}"? This action cannot be undone and will affect all associated majors and users.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDepartment(department.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}