import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Shield, Users, Building2, GraduationCap, School, BookOpen, Calendar, CheckCircle, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockRoles } from "@/api/mockData";
import type { Role, Permission, Resource } from "@/types";

const RESOURCES: Resource[] = ["Users", "Departments", "Majors", "Classes", "Courses", "Schedule", "Attendance", "Announcements"];
const PERMISSIONS: Permission[] = ["Create", "Read", "Update", "Delete", "Export"];

const RESOURCE_ICONS = {
  Users: Users,
  Departments: Building2,
  Majors: GraduationCap,
  Classes: School,
  Courses: BookOpen,
  Schedule: Calendar,
  Attendance: CheckCircle,
  Announcements: Megaphone,
};

const ROLE_TEMPLATES = {
  "Academic Staff": {
    Users: ["Read"],
    Departments: ["Read"],
    Majors: ["Read"],
    Classes: ["Read", "Update"],
    Courses: ["Read"],
    Schedule: ["Read", "Create", "Update"],
    Attendance: ["Read", "Create", "Update"],
    Announcements: ["Read", "Create"],
  },
  "Viewer": {
    Users: ["Read"],
    Departments: ["Read"],
    Majors: ["Read"],
    Classes: ["Read"],
    Courses: ["Read"],
    Schedule: ["Read"],
    Attendance: ["Read"],
    Announcements: ["Read"],
  },
  "Department Head": {
    Users: ["Read", "Update"],
    Departments: ["Read", "Update"],
    Majors: ["Create", "Read", "Update", "Delete"],
    Classes: ["Create", "Read", "Update", "Delete"],
    Courses: ["Create", "Read", "Update", "Delete"],
    Schedule: ["Create", "Read", "Update", "Delete"],
    Attendance: ["Read", "Update"],
    Announcements: ["Create", "Read", "Update", "Delete"],
  },
};

export default function RolePermission() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Record<Resource, Permission[]>>({} as Record<Resource, Permission[]>);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoles(mockRoles);
      if (mockRoles.length > 0) {
        setSelectedRole(mockRoles[0]);
        setPermissions(mockRoles[0].permissions);
      }
      setLoading(false);
    }, 600);
  }, []);

  const handleRoleSelect = (role: Role) => {
    if (hasUnsavedChanges) {
      // In a real app, show confirmation dialog
      if (!confirm("You have unsaved changes. Discard them?")) return;
    }
    setSelectedRole(role);
    setPermissions(role.permissions);
    setHasUnsavedChanges(false);
  };

  const handlePermissionToggle = (resource: Resource, permission: Permission) => {
    const currentPermissions = permissions[resource] || [];
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];

    setPermissions(prev => ({
      ...prev,
      [resource]: newPermissions
    }));
    setHasUnsavedChanges(true);
  };

  const handleBulkToggleResource = (resource: Resource, enabled: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [resource]: enabled ? [...PERMISSIONS] : []
    }));
    setHasUnsavedChanges(true);
  };

  const handleBulkTogglePermission = (permission: Permission, enabled: boolean) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      RESOURCES.forEach(resource => {
        const current = newPermissions[resource] || [];
        if (enabled) {
          if (!current.includes(permission)) {
            newPermissions[resource] = [...current, permission];
          }
        } else {
          newPermissions[resource] = current.filter(p => p !== permission);
        }
      });
      return newPermissions;
    });
    setHasUnsavedChanges(true);
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;

    // Simulate API call
    setTimeout(() => {
      setRoles(prev => prev.map(role =>
        role.id === selectedRole.id
          ? { ...role, permissions, updatedAt: new Date().toISOString() }
          : role
      ));
      setHasUnsavedChanges(false);
      // Show success message
    }, 500);
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    const templatePermissions = selectedTemplate ? ROLE_TEMPLATES[selectedTemplate as keyof typeof ROLE_TEMPLATES] : {};

    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: newRoleName,
      description: newRoleDescription,
      permissions: templatePermissions as Record<Resource, Permission[]>,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoles(prev => [...prev, newRole]);
    setNewRoleName("");
    setNewRoleDescription("");
    setSelectedTemplate("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
    if (selectedRole?.id === roleId) {
      const remainingRoles = roles.filter(role => role.id !== roleId);
      if (remainingRoles.length > 0) {
        setSelectedRole(remainingRoles[0]);
        setPermissions(remainingRoles[0].permissions);
      } else {
        setSelectedRole(null);
        setPermissions(RESOURCES.reduce((acc, resource) => {
          acc[resource] = [];
          return acc;
        }, {} as Record<Resource, Permission[]>));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading roles..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Role & Permission Management"
        description="Manage user roles and their permissions"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Role Management" },
        ]}
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Enter role description"
                  />
                </div>
                <div>
                  <Label htmlFor="template">Start with Template (Optional)</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No template</SelectItem>
                      {Object.keys(ROLE_TEMPLATES).map(template => (
                        <SelectItem key={template} value={template}>{template}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>
                    Create Role
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roles.map((role) => {
                  const Icon = Shield;
                  return (
                    <div
                      key={role.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedRole?.id === role.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => handleRoleSelect(role)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{role.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permission Matrix */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Permissions for {selectedRole?.name || "No Role Selected"}
                </CardTitle>
                {hasUnsavedChanges && (
                  <Badge variant="secondary">Unsaved Changes</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedRole ? (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Resource</th>
                            {PERMISSIONS.map(permission => (
                              <th key={permission} className="text-center p-3 font-medium min-w-[100px]">
                                {permission}
                              </th>
                            ))}
                            <th className="text-center p-3 font-medium">All</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RESOURCES.map(resource => {
                            const Icon = RESOURCE_ICONS[resource];
                            const resourcePermissions = permissions[resource] || [];
                            const allEnabled = PERMISSIONS.every(p => resourcePermissions.includes(p));

                            return (
                              <tr key={resource} className="border-b hover:bg-muted/50">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{resource}</span>
                                  </div>
                                </td>
                                {PERMISSIONS.map(permission => (
                                  <td key={permission} className="text-center p-3">
                                    <Switch
                                      checked={resourcePermissions.includes(permission)}
                                      onCheckedChange={() => handlePermissionToggle(resource, permission)}
                                    />
                                  </td>
                                ))}
                                <td className="text-center p-3">
                                  <Switch
                                    checked={allEnabled}
                                    onCheckedChange={(checked) => handleBulkToggleResource(resource, checked)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="border-t-2">
                            <td className="p-3 font-medium">All Resources</td>
                            {PERMISSIONS.map(permission => {
                              const allHavePermission = RESOURCES.every(resource =>
                                (permissions[resource] || []).includes(permission)
                              );
                              return (
                                <td key={permission} className="text-center p-3">
                                  <Switch
                                    checked={allHavePermission}
                                    onCheckedChange={(checked) => handleBulkTogglePermission(permission, checked)}
                                  />
                                </td>
                              );
                            })}
                            <td className="text-center p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const allPermissions = RESOURCES.reduce((acc, resource) => {
                                    acc[resource] = [...PERMISSIONS];
                                    return acc;
                                  }, {} as Record<Resource, Permission[]>);
                                  setPermissions(allPermissions);
                                  setHasUnsavedChanges(true);
                                }}
                              >
                                Select All
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden">
                    <Accordion type="single" collapsible>
                      {RESOURCES.map(resource => {
                        const Icon = RESOURCE_ICONS[resource];
                        const resourcePermissions = permissions[resource] || [];

                        return (
                          <AccordionItem key={resource} value={resource}>
                            <AccordionTrigger>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{resource}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pl-6">
                                {PERMISSIONS.map(permission => (
                                  <div key={permission} className="flex items-center justify-between">
                                    <Label htmlFor={`${resource}-${permission}`}>{permission}</Label>
                                    <Switch
                                      id={`${resource}-${permission}`}
                                      checked={resourcePermissions.includes(permission)}
                                      onCheckedChange={() => handlePermissionToggle(resource, permission)}
                                    />
                                  </div>
                                ))}
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <Label>All Permissions</Label>
                                  <Switch
                                    checked={PERMISSIONS.every(p => resourcePermissions.includes(p))}
                                    onCheckedChange={(checked) => handleBulkToggleResource(resource, checked)}
                                  />
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPermissions(selectedRole.permissions);
                        setHasUnsavedChanges(false);
                      }}
                      disabled={!hasUnsavedChanges}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={handleSavePermissions} disabled={!hasUnsavedChanges}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a role to manage permissions
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}