import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, Building2, Eye } from "lucide-react";
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
import { API_ENDPOINTS, get } from "@/api/config";
import type { Department, StaffProfile } from "@/types";

export default function Department() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([]);
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
  }, []);

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
      const response = await fetch(API_ENDPOINTS.ADMIN.DEPARTMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          description: formData.description,
          is_active: formData.is_active,
          head_of_department: formData.head_of_department && formData.head_of_department !== "none" ? parseInt(formData.head_of_department) : null,
          building_location: formData.building_location,
          contact_email: formData.contact_email,
        }),
      });

      if (response.ok) {
        const newDepartment = await response.json();
        setDepartments(prev => [...prev, newDepartment]);
        resetForm();
        setIsCreateDialogOpen(false);
      } else {
        console.error('Failed to create department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleEditDepartment = async () => {
    if (!editingDepartment || !formData.name.trim() || !formData.code.trim()) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}${editingDepartment.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          description: formData.description,
          is_active: formData.is_active,
          head_of_department: formData.head_of_department && formData.head_of_department !== "none" ? parseInt(formData.head_of_department) : null,
          building_location: formData.building_location,
          contact_email: formData.contact_email,
        }),
      });

      if (response.ok) {
        const updatedDepartment = await response.json();
        setDepartments(prev => prev.map(dept =>
          dept.id === editingDepartment.id ? updatedDepartment : dept
        ));
        resetForm();
        setEditingDepartment(null);
      } else {
        console.error('Failed to update department');
      }
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}${departmentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
      } else {
        console.error('Failed to delete department');
      }
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
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deptName">Department Name *</Label>
                  <Input
                    id="deptName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter department name"
                  />
                </div>
                <div>
                  <Label htmlFor="deptCode">Department Code *</Label>
                  <Input
                    id="deptCode"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Enter department code (e.g., CS, BA)"
                  />
                </div>
                <div>
                  <Label htmlFor="deptDescription">Description</Label>
                  <Textarea
                    id="deptDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter department description"
                  />
                </div>
                <div>
                  <Label htmlFor="deptBuilding">Building Location</Label>
                  <Input
                    id="deptBuilding"
                    value={formData.building_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, building_location: e.target.value }))}
                    placeholder="Enter building location"
                  />
                </div>
                <div>
                  <Label htmlFor="deptHead">Head of Department</Label>
                  <Select value={formData.head_of_department} onValueChange={(value) => setFormData(prev => ({ ...prev, head_of_department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select head of department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {staffProfiles.length > 0 ? (
                        staffProfiles.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id.toString()}>
                            {staff.full_name} ({staff.position})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No staff members available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deptEmail">Contact Email</Label>
                  <Input
                    id="deptEmail"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label htmlFor="deptStatus">Status</Label>
                  <Select value={formData.is_active ? "active" : "inactive"} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, is_active: value === "active" }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDepartment} disabled={!formData.name.trim() || !formData.code.trim()}>
                    Create Department
                  </Button>
                </div>
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
                      <span className="text-sm">0 majors</span>
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
                                      <CardTitle className="text-lg">Majors (0)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-center py-8 text-muted-foreground">
                                        Major list would be displayed here
                                      </div>
                                      <div className="flex gap-2">
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Department</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="editDeptName">Department Name *</Label>
                                  <Input
                                    id="editDeptName"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter department name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editDeptCode">Department Code *</Label>
                                  <Input
                                    id="editDeptCode"
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                    placeholder="Enter department code (e.g., CS, BA)"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editDeptDescription">Description</Label>
                                  <Textarea
                                    id="editDeptDescription"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter department description"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editDeptBuilding">Building Location</Label>
                                  <Input
                                    id="editDeptBuilding"
                                    value={formData.building_location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, building_location: e.target.value }))}
                                    placeholder="Enter building location"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editDeptHead">Head of Department</Label>
                                  <Select value={formData.head_of_department} onValueChange={(value) => setFormData(prev => ({ ...prev, head_of_department: value }))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select head of department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      {staffProfiles.length > 0 ? (
                                        staffProfiles.map((staff) => (
                                          <SelectItem key={staff.id} value={staff.id.toString()}>
                                            {staff.full_name} ({staff.position})
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="none" disabled>
                                          No staff members available
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="editDeptEmail">Contact Email</Label>
                                  <Input
                                    id="editDeptEmail"
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                    placeholder="Enter contact email"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editDeptStatus">Status</Label>
                                  <Select value={formData.is_active ? "active" : "inactive"} onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value === "active" }))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => {
                                    resetForm();
                                    setEditingDepartment(null);
                                  }}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditDepartment} disabled={!formData.name.trim() || !formData.code.trim()}>
                                    Update Department
                                  </Button>
                                </div>
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