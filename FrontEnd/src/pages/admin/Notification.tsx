import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical, Megaphone, Send, Eye, Clock, CheckCircle, XCircle, User as UserIcon, Building2, GraduationCap, School, Users, Mail, MessageSquare, Smartphone } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { mockUsers, mockDepartments, mockMajors } from "@/api/mockData";
import type { Notification, NotificationAudience, NotificationStatus, User as UserType, Department, Major } from "@/types";

export default function Notification() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users] = useState<UserType[]>(mockUsers);
  const [departments] = useState<Department[]>(mockDepartments);
  const [majors] = useState<Major[]>(mockMajors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: "notif_1",
      title: "Mid-term Exam Schedule",
      message: "Dear students, the mid-term examinations will begin next week. Please check your schedules and prepare accordingly.",
      audience: "All",
      creatorId: "u_1",
      creator: mockUsers[0],
      scheduledAt: "2024-10-25T09:00:00Z",
      sentAt: "2024-10-25T09:00:00Z",
      status: "Sent",
      attachments: [],
      createdAt: "2024-10-20T10:00:00Z",
      updatedAt: "2024-10-25T09:00:00Z",
    },
    {
      id: "notif_2",
      title: "Library Hours Extended",
      message: "The university library will remain open until 10 PM during exam week to accommodate study needs.",
      audience: "All",
      creatorId: "u_1",
      creator: mockUsers[0],
      scheduledAt: "2024-10-28T08:00:00Z",
      status: "Scheduled",
      attachments: [],
      createdAt: "2024-10-22T14:30:00Z",
      updatedAt: "2024-10-22T14:30:00Z",
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "All" as NotificationAudience,
    targetIds: [] as string[],
    scheduledAt: "",
    sendNow: true,
    pushNotification: true,
    emailNotification: true,
    inAppNotification: true,
    attachments: [] as File[],
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 600);
  }, []);

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || notif.status === statusFilter;
    const matchesAudience = audienceFilter === "all" || notif.audience === audienceFilter;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const handleCreateNotification = () => {
    if (!formData.title.trim() || !formData.message.trim()) return;

    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      title: formData.title,
      message: formData.message,
      audience: formData.audience,
      targetIds: formData.targetIds,
      creatorId: "u_1", // Current user
      creator: mockUsers[0],
      scheduledAt: formData.sendNow ? new Date().toISOString() : formData.scheduledAt,
      sentAt: formData.sendNow ? new Date().toISOString() : undefined,
      status: formData.sendNow ? "Sent" : "Scheduled",
      attachments: formData.attachments.map(f => f.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditNotification = () => {
    if (!editingNotification || !formData.title.trim() || !formData.message.trim()) return;

    const updatedNotification: Notification = {
      ...editingNotification,
      title: formData.title,
      message: formData.message,
      audience: formData.audience,
      targetIds: formData.targetIds,
      scheduledAt: formData.sendNow ? new Date().toISOString() : formData.scheduledAt,
      sentAt: formData.sendNow ? new Date().toISOString() : editingNotification.sentAt,
      status: formData.sendNow ? "Sent" : "Scheduled",
      attachments: formData.attachments.map(f => f.name),
      updatedAt: new Date().toISOString(),
    };

    setNotifications(prev => prev.map(notif =>
      notif.id === editingNotification.id ? updatedNotification : notif
    ));
    resetForm();
    setEditingNotification(null);
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleSendTest = () => {
    // Simulate sending test notification
    console.log("Sending test notification");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      audience: "All",
      targetIds: [],
      scheduledAt: "",
      sendNow: true,
      pushNotification: true,
      emailNotification: true,
      inAppNotification: true,
      attachments: [],
    });
  };

  const openEditDialog = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      audience: notification.audience,
      targetIds: notification.targetIds || [],
      scheduledAt: notification.scheduledAt || "",
      sendNow: !notification.scheduledAt,
      pushNotification: true,
      emailNotification: true,
      inAppNotification: true,
      attachments: [],
    });
  };

  const getAudienceIcon = (audience: NotificationAudience) => {
    switch (audience) {
      case "All": return Users;
      case "Department": return Building2;
      case "Major": return GraduationCap;
      case "Class": return School;
      case "Role": return UserIcon;
      default: return Users;
    }
  };

  const getStatusIcon = (status: NotificationStatus) => {
    switch (status) {
      case "Sent": return CheckCircle;
      case "Scheduled": return Clock;
      case "Draft": return Edit;
      default: return XCircle;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notification Management"
        description="Create and manage announcements and notifications"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Notifications" },
        ]}
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="audience">Audience</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter announcement message"
                      rows={6}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="audience" className="space-y-4">
                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select value={formData.audience} onValueChange={(value: NotificationAudience) => setFormData(prev => ({ ...prev, audience: value, targetIds: [] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Users</SelectItem>
                        <SelectItem value="Department">Specific Departments</SelectItem>
                        <SelectItem value="Major">Specific Majors</SelectItem>
                        <SelectItem value="Class">Specific Classes</SelectItem>
                        <SelectItem value="Role">Specific Roles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.audience !== "All" && (
                    <div>
                      <Label>Select Targets</Label>
                      <div className="border rounded p-4 max-h-40 overflow-y-auto space-y-2">
                        {formData.audience === "Department" && departments.map(dept => (
                          <div key={dept.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`dept-${dept.id}`}
                              checked={formData.targetIds.includes(dept.id)}
                              onCheckedChange={(checked) => {
                                const newTargets = checked
                                  ? [...formData.targetIds, dept.id]
                                  : formData.targetIds.filter(id => id !== dept.id);
                                setFormData(prev => ({ ...prev, targetIds: newTargets }));
                              }}
                            />
                            <Label htmlFor={`dept-${dept.id}`}>{dept.name}</Label>
                          </div>
                        ))}
                        {formData.audience === "Major" && majors.map(major => (
                          <div key={major.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`major-${major.id}`}
                              checked={formData.targetIds.includes(major.id)}
                              onCheckedChange={(checked) => {
                                const newTargets = checked
                                  ? [...formData.targetIds, major.id]
                                  : formData.targetIds.filter(id => id !== major.id);
                                setFormData(prev => ({ ...prev, targetIds: newTargets }));
                              }}
                            />
                            <Label htmlFor={`major-${major.id}`}>{major.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="delivery" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendNow"
                        checked={formData.sendNow}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendNow: !!checked }))}
                      />
                      <Label htmlFor="sendNow">Send immediately</Label>
                    </div>
                    {!formData.sendNow && (
                      <div>
                        <Label htmlFor="scheduledAt">Schedule for</Label>
                        <Input
                          id="scheduledAt"
                          type="datetime-local"
                          value={formData.scheduledAt}
                          onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label>Delivery Methods</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4" />
                          <Label>Push Notification</Label>
                        </div>
                        <Switch
                          checked={formData.pushNotification}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pushNotification: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <Label>Email</Label>
                        </div>
                        <Switch
                          checked={formData.emailNotification}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotification: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <Label>In-App Notification</Label>
                        </div>
                        <Switch
                          checked={formData.inAppNotification}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inAppNotification: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="attachments" className="space-y-4">
                  <div>
                    <Label htmlFor="attachments">Attachments</Label>
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setFormData(prev => ({ ...prev, attachments: files }));
                      }}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                    </p>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Files:</Label>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newAttachments = formData.attachments.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, attachments: newAttachments }));
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleSendTest}>
                  <Eye className="mr-2 h-4 w-4" />
                  Send Test
                </Button>
                <Button onClick={handleCreateNotification} disabled={!formData.title.trim() || !formData.message.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  {formData.sendNow ? "Send Now" : "Schedule"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={audienceFilter} onValueChange={setAudienceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Audience</SelectItem>
              <SelectItem value="All">All Users</SelectItem>
              <SelectItem value="Department">Department</SelectItem>
              <SelectItem value="Major">Major</SelectItem>
              <SelectItem value="Class">Class</SelectItem>
              <SelectItem value="Role">Role</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications Table */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No notifications found"
          description="Try adjusting your search criteria or create a new announcement"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Announcement</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Scheduled/Sent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => {
                const AudienceIcon = getAudienceIcon(notification.audience);
                const StatusIcon = getStatusIcon(notification.status);
                return (
                  <TableRow key={notification.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AudienceIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{notification.audience}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={notification.creator.avatar} />
                          <AvatarFallback className="text-xs">
                            {notification.creator.firstName[0]}{notification.creator.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{notification.creator.firstName} {notification.creator.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {notification.sentAt
                        ? new Date(notification.sentAt).toLocaleString()
                        : notification.scheduledAt
                        ? new Date(notification.scheduledAt).toLocaleString()
                        : "Not scheduled"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${
                          notification.status === "Sent" ? "text-green-500" :
                          notification.status === "Scheduled" ? "text-blue-500" :
                          "text-gray-500"
                        }`} />
                        <Badge variant={
                          notification.status === "Sent" ? "default" :
                          notification.status === "Scheduled" ? "secondary" :
                          "outline"
                        }>
                          {notification.status}
                        </Badge>
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
                          <DropdownMenuItem onClick={() => {
                            setSelectedNotification(notification);
                            setIsPreviewDialogOpen(true);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(notification)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleSendTest}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Test
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
                                <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{notification.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteNotification(notification.id)}>
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Announcement Preview</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedNotification.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    {selectedNotification.creator.firstName} {selectedNotification.creator.lastName}
                    <span>•</span>
                    {selectedNotification.sentAt
                      ? new Date(selectedNotification.sentAt).toLocaleString()
                      : selectedNotification.scheduledAt
                      ? `Scheduled for ${new Date(selectedNotification.scheduledAt).toLocaleString()}`
                      : "Draft"
                    }
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{selectedNotification.message}</p>
                  {selectedNotification.attachments && selectedNotification.attachments.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Attachments:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedNotification.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline">
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}