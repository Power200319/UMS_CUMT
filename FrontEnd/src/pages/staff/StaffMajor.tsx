import { useState, useEffect } from "react";
import { Search, Eye, GraduationCap, Building2, Users, FileText } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { mockMajors, mockDepartments } from "@/api/mockData";
import type { Major, Department, AcademicLevel } from "@/types";

export default function StaffMajor() {
  const [loading, setLoading] = useState(true);
  const [majors, setMajors] = useState<Major[]>([]);
  const [departments] = useState<Department[]>(mockDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);

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
        description="View academic programs and major information"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff" },
          { label: "Majors" },
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
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background text-sm"
          title="Filter by department"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background text-sm"
          title="Filter by level"
        >
          <option value="all">All Levels</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="Doctorate">Doctorate</option>
        </select>
      </div>

      {/* Majors Table */}
      {filteredMajors.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No majors found"
          description="Try adjusting your search criteria"
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
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setSelectedMajor(major);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>{selectedMajor?.name} Details</DrawerTitle>
                            </DrawerHeader>
                            {selectedMajor && (
                              <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Major Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <p>{selectedMajor.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Code</label>
                                        <p>{selectedMajor.code}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Department</label>
                                        <p>{selectedMajor.department.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Level</label>
                                        <Badge variant="secondary">{selectedMajor.level}</Badge>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Description</label>
                                        <p>{selectedMajor.description || "No description"}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <Badge variant={selectedMajor.status === "active" ? "default" : "secondary"}>
                                          {selectedMajor.status}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Program Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">Duration</label>
                                        <p>{selectedMajor.duration} years</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Required Credits</label>
                                        <p>{selectedMajor.requiredCredits} credits</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Accreditation</label>
                                        <p>{selectedMajor.accreditation || "Not specified"}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Active Students</label>
                                        <p>{selectedMajor.activeStudents} students</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Classes</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                      Class list would be displayed here
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" className="flex-1">
                                        View All Classes
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}