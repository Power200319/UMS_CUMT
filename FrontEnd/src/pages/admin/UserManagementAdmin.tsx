import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit, Eye, Search, Filter, Shield, UserCheck, GraduationCap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'staff' | 'teacher' | 'student';
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  department?: string;
  class_name?: string;
}

export default function UserManagementAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock user data for admin view
      const mockUsers: User[] = [
        {
          id: 1,
          username: "admin@university.edu",
          email: "admin@university.edu",
          first_name: "System",
          last_name: "Administrator",
          role: "admin",
          is_active: true,
          date_joined: "2024-01-01T00:00:00Z",
          last_login: "2024-01-15T09:00:00Z",
          department: "IT"
        },
        {
          id: 2,
          username: "staff@university.edu",
          email: "staff@university.edu",
          first_name: "Academic",
          last_name: "Staff",
          role: "staff",
          is_active: true,
          date_joined: "2024-01-01T00:00:00Z",
          last_login: "2024-01-15T08:30:00Z",
          department: "Academic Office"
        },
        {
          id: 3,
          username: "john.doe@university.edu",
          email: "john.doe@university.edu",
          first_name: "John",
          last_name: "Doe",
          role: "teacher",
          is_active: true,
          date_joined: "2024-01-10T00:00:00Z",
          last_login: "2024-01-15T07:45:00Z",
          department: "Computer Science"
        },
        {
          id: 4,
          username: "jane.smith@university.edu",
          email: "jane.smith@university.edu",
          first_name: "Jane",
          last_name: "Smith",
          role: "student",
          is_active: true,
          date_joined: "2024-01-05T00:00:00Z",
          last_login: "2024-01-15T08:00:00Z",
          class_name: "CS101"
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: "destructive" as const, icon: Shield, label: "Admin" },
      staff: { variant: "default" as const, icon: Settings, label: "Staff" },
      teacher: { variant: "secondary" as const, icon: GraduationCap, label: "Teacher" },
      student: { variant: "outline" as const, icon: UserCheck, label: "Student" }
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleEditUser = (userId: number) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleToggleUserStatus = async (userId: number) => {
    // In real implementation, this would make an API call
    setUsers(users.map(user =>
      user.id === userId ? { ...user, is_active: !user.is_active } : user
    ));
  };

  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-1">Complete control over all system users</p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.is_active).length}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-sm text-gray-600">Administrators</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.last_login && new Date(u.last_login) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-gray-600">Active Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterRole('all');
              setFilterStatus('all');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-lg">{selectedUser.first_name} {selectedUser.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Username</Label>
                  <p className="text-lg">{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-lg">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-lg">
                    <Badge variant={selectedUser.is_active ? "default" : "secondary"}>
                      {selectedUser.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department/Class</Label>
                  <p className="text-lg">{selectedUser.department || selectedUser.class_name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date Joined</Label>
                  <p className="text-lg">{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Login</Label>
                  <p className="text-lg">
                    {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}