import { useState, useEffect } from "react";
import { Search, Eye, Building2, User, Phone, Mail } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { mockDepartments, mockUsers } from "@/api/mockData";
import type { Department, User as UserType } from "@/types";

export default function StaffDepartment() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "code">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

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
        description="View department information and contacts"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff" },
          { label: "Departments" },
        ]}
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
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-') as ["name" | "code", "asc" | "desc"];
            setSortBy(field);
            setSortOrder(order);
          }}
          className="px-3 py-2 border rounded-md bg-background text-sm"
          title="Sort departments"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="code-asc">Code (A-Z)</option>
          <option value="code-desc">Code (Z-A)</option>
        </select>
      </div>

      {/* Departments Table */}
      {filteredAndSortedDepartments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="Try adjusting your search criteria"
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
                            <Eye className="h-4 w-4" />
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
                                          <label className="text-sm font-medium">Name</label>
                                          <p>{selectedDepartment.name}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Code</label>
                                          <p>{selectedDepartment.code}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Description</label>
                                          <p>{selectedDepartment.description || "No description"}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Status</label>
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
                                            <label className="text-sm font-medium">Email</label>
                                            <p>{selectedDepartment.contactEmail || "Not provided"}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <label className="text-sm font-medium">Phone</label>
                                            <p>{selectedDepartment.contactPhone || "Not provided"}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <label className="text-sm font-medium">Department Head</label>
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
                                          View All Majors
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DrawerContent>
                          </Drawer>
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