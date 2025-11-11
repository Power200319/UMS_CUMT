import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: number;
  full_name: string;
  email: string;
  class_name: string;
  department: string;
  major: string;
  study_year: string;
  semester: string;
  phone: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/student/');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || student.class_name === filterClass;
    const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;

    return matchesSearch && matchesClass && matchesDepartment;
  });

  const uniqueClasses = [...new Set(students.map(s => s.class_name))];
  const uniqueDepartments = [...new Set(students.map(s => s.department))];

  const handleViewDetails = (studentId: number) => {
    navigate(`/staff/students/${studentId}`);
  };

  const handleEditStudent = (studentId: number) => {
    navigate(`/staff/students/${studentId}/edit`);
  };

  const handleAssignToClass = (studentId: number) => {
    navigate(`/staff/students/${studentId}/assign`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage student accounts and class assignments</p>
        </div>
        <Button onClick={() => navigate('/staff/student-registration')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Student
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterClass('all');
              setFilterDepartment('all');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Year/Semester</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.full_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.class_name}</Badge>
                  </TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{student.study_year}/{student.semester}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(student.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStudent(student.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignToClass(student.id)}
                      >
                        Assign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {students.length === 0 ? 'No students found.' : 'No students match your filters.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{uniqueClasses.length}</p>
              <p className="text-sm text-gray-600">Active Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{uniqueDepartments.length}</p>
              <p className="text-sm text-gray-600">Departments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {students.filter(s => s.class_name).length}
              </p>
              <p className="text-sm text-gray-600">Assigned Students</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}