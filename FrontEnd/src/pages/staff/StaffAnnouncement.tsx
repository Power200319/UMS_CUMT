import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, MoreVertical, Megaphone, Eye, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";
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
import { mockUsers } from "@/api/mockData";
import type { User as UserType } from "@/types";
import { Calendar } from "@/components/ui/calendar";

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: "general" | "academic" | "event" | "emergency" | "administrative";
  priority: "low" | "medium" | "high" | "urgent";
  targetAudience: "all" | "students" | "staff" | "lecturers" | "specific";
  status: "draft" | "published" | "scheduled" | "archived";
  createdBy: UserType;
  createdAt: string;
  publishedAt?: string;
  scheduledAt?: string;
  views: number;
  recipients: number;
};

export default function StaffAnnouncement() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general" as Announcement["type"],
    priority: "medium" as Announcement["priority"],
    targetAudience: "all" as Announcement["targetAudience"],
    status: "draft" as Announcement["status"],
    scheduledAt: "",
  });

  // Mock announcements data
  const mockAnnouncements: Announcement[] = [
    {
      id: "ann_1",
      title: "Mid-term Examination Schedule",
      content: "The mid-term examinations for Semester 1 will begin on November 15th. Please check your individual schedules.",
      type: "academic",
      priority: "high",
      targetAudience: "students",
      status: "published",
      createdBy: mockUsers[1],
      createdAt: "2025-10-20T09:00:00Z",
      publishedAt: "2025-10-20T10:00:00Z",
      views: 1250,
      recipients: 1200,
    },
    {
      id: "ann_2",
      title: "Campus Maintenance Notice",
      content: "The main library will be closed for maintenance from October 25th to October 27th.",
      type: "administrative",
      priority: "medium",
      targetAudience: "all",
      status: "published",
      createdBy: mockUsers[2],
      createdAt: "2025-10-18T14:30:00Z",
      publishedAt: "2025-10-18T15:00:00Z",
      views: 890,
      recipients: 1450,
    },
    {
      id: "ann_3",
      title: "Welcome Event for New Students",
      content: "Join us for the welcome event on October 30th at the main auditorium.",
      type: "event",
      priority: "low",
      targetAudience: "students",
      status: "scheduled",
      createdBy: mockUsers[1],
      createdAt: "2025-10-15T11:00:00Z",
      scheduledAt: "2025-10-30T09:00:00Z",
      views: 0,
      recipients: 200,
    },
    {
      id: "ann_4",
      title: "Draft: Holiday Schedule Update",
      content: "Updated holiday schedule for the upcoming academic year.",
      type: "administrative",
      priority: "medium",
      targetAudience: "all",
      status: "draft",
      createdBy: mockUsers[2],
      createdAt: "2025-10-25T08:00:00Z",
      views: 0,
      recipients: 0,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 600);
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || announcement.type === typeFilter;
    const matchesStatus = statusFilter === "all" || announcement.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateAnnouncement = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title: formData.title,
      content: formData.content,
      type: formData.type,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      status: formData.status,
      createdBy: mockUsers[1], // Current user
      createdAt: new Date().toISOString(),
      publishedAt: formData.status === "published" ? new Date().toISOString() : undefined,
      scheduledAt: formData.scheduledAt || undefined,
      views: 0,
      recipients: 0,
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditAnnouncement = () => {
    if (!editingAnnouncement || !formData.title.trim() || !formData.content.trim()) return;

    const updatedAnnouncement: Announcement = {
      ...editingAnnouncement,
      title: formData.title,
      content: formData.content,
      type: formData.type,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      status: formData.status,
      scheduledAt: formData.scheduledAt || undefined,
    };

    setAnnouncements(prev => prev.map(ann =>
      ann.id === editingAnnouncement.id ? updatedAnnouncement : ann
    ));
    resetForm();
    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== announcementId));
  };

  const handlePublishAnnouncement = (announcement: Announcement) => {
    setAnnouncements(prev => prev.map(ann =>
      ann.id === announcement.id
        ? { ...ann, status: "published", publishedAt: new Date().toISOString() }
        : ann
    ));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "general",
      priority: "medium",
      targetAudience: "all",
      status: "draft",
      scheduledAt: "",
    });
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      status: announcement.status,
      scheduledAt: announcement.scheduledAt || "",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "emergency":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "administrative":
        return <Megaphone className="h-4 w-4 text-purple-500" />;
      default:
        return <Megaphone className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      general: "secondary",
      academic: "default",
      event: "outline",
      emergency: "destructive",
      administrative: "secondary",
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || "secondary"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      medium: "outline",
      high: "default",
      urgent: "destructive",
    } as const;

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "secondary"}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      published: "default",
      scheduled: "outline",
      archived: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAnnouncementStats = () => {
    const total = announcements.length;
    const published = announcements.filter(a => a.status === "published").length;
    const draft = announcements.filter(a => a.status === "draft").length;
    const scheduled = announcements.filter(a => a.status === "scheduled").length;
    const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);

    return { total, published, draft, scheduled, totalViews };
  };

  const stats = getAnnouncementStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading announcements..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Announcement Management"
        description="Create and manage announcements for the university community"
        breadcrumbs={[
          { label: "Dashboard", href: "/staff" },
          { label: "Announcements" },
        ]}
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="annTitle">Title *</Label>
                  <Input
                    id="annTitle"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <Label htmlFor="annContent">Content *</Label>
                  <Textarea
                    id="annContent"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter announcement content"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annType">Type</Label>
                    <Select value={formData.type} onValueChange={(value: Announcement["type"]) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="annPriority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: Announcement["priority"]) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annAudience">Target Audience</Label>
                    <Select value={formData.targetAudience} onValueChange={(value: Announcement["targetAudience"]) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="lecturers">Lecturers</SelectItem>
                        <SelectItem value="specific">Specific Groups</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="annStatus">Status</Label>
                    <Select value={formData.status} onValueChange={(value: Announcement["status"]) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Publish Now</SelectItem>
                        <SelectItem value="scheduled">Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.status === "scheduled" && (
                  <div>
                    <Label htmlFor="annSchedule">Schedule Date & Time</Label>
                    <Input
                      id="annSchedule"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement} disabled={!formData.title.trim() || !formData.content.trim()}>
                    Create Announcement
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Announcement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="administrative">Administrative</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Announcements Table */}
      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements found"
          description="Try adjusting your search criteria or create a new announcement"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Announcement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement) => (
                <TableRow key={announcement.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={announcement.createdBy.avatar} />
                          <AvatarFallback className="text-xs">
                            {announcement.createdBy.firstName[0]}{announcement.createdBy.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          by {announcement.createdBy.firstName} {announcement.createdBy.lastName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(announcement.type)}
                      {getTypeBadge(announcement.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(announcement.priority)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(announcement.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{announcement.views.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(announcement)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {announcement.status === "draft" && (
                          <DropdownMenuItem onClick={() => handlePublishAnnouncement(announcement)}>
                            <Send className="mr-2 h-4 w-4" />
                            Publish Now
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
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
                                Are you sure you want to delete "{announcement.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAnnouncement(announcement.id)}>
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