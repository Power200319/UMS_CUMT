import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, Building2, User, Phone, Mail, Eye } from "lucide-react";
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
import { mockDepartments, mockUsers } from "@/api/mockData";
import type { Department, User as UserType } from "@/types";

export default function Department() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    headId: "",
    contactEmail: "",
    contactPhone: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDepartments(mockDepartments);
      setLoading(false);
    }, 600);
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

  const handleCreateDepartment = () => {
    if (!formData.name.trim() || !formData.code.trim()) return;

    const newDepartment: Department = {
      id: `dept_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      headId: formData.headId || undefined,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      majorCount: 0,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDepartments(prev => [...prev, newDepartment]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditDepartment = () => {
    if (!editingDepartment || !formData.name.trim() || !formData.code.trim()) return;

    const updatedDepartment: Department = {
      ...editingDepartment,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      headId: formData.headId || undefined,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    setDepartments(prev => prev.map(dept =>
      dept.id === editingDepartment.id ? updatedDepartment : dept
    ));
    resetForm();
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      headId: "",
      contactEmail: "",
      contactPhone: "",
      status: "active",
    });
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || "",
      headId: department.headId || "",
      contactEmail: department.contactEmail || "",
      contactPhone: department.contactPhone || "",
      status: department.status,
    });
  };

  const getHeadUser = (headId?: string): UserType | undefined => {
    return mockUsers.find(user => user.id === headId);
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
                  <Label htmlFor="deptHead">Department Head</Label>
                  <Select value={formData.headId} onValueChange={(value) => setFormData(prev => ({ ...prev, headId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department head" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.filter(user => user.roles.includes("Lecturer") || user.roles.includes("Admin")).map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="Enter contact phone"
                  />
                </div>
                <div>
                  <Label htmlFor="deptStatus">Status</Label>
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
                const headUser = getHeadUser(department.headId);
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
                      {headUser ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={headUser.avatar} />
                            <AvatarFallback className="text-xs">
                              {headUser.firstName[0]}{headUser.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{headUser.firstName} {headUser.lastName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{department.majorCount} majors</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={department.status === "active" ? "default" : "secondary"}>
                        {department.status}
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
                                          <Label className="text-sm font-medium">Status</Label>
                                          <Badge variant={selectedDepartment.status === "active" ? "default" : "secondary"}>
                                            {selectedDepartment.status}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Contact Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <Label className="text-sm font-medium">Email</Label>
                                            <p>{selectedDepartment.contactEmail || "Not provided"}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <Label className="text-sm font-medium">Phone</Label>
                                            <p>{selectedDepartment.contactPhone || "Not provided"}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <Label className="text-sm font-medium">Department Head</Label>
                                            <p>{getHeadUser(selectedDepartment.headId)?.firstName} {getHeadUser(selectedDepartment.headId)?.lastName || "Not assigned"}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Majors ({selectedDepartment.majorCount})</CardTitle>
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
                          <DropdownMenuItem onClick={() => openEditDialog(department)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
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