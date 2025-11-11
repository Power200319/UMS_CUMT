import { useState, useEffect } from "react";
import { Bell, Plus, Edit, Trash2, Eye, Send, Clock, Users, AlertTriangle, Info, BookOpen, Calendar } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { API_ENDPOINTS, get } from "@/api/config";
import { useResponsive } from "@/hooks/useResponsive";
import type { User, TeacherProfile } from "@/types";

type AnnouncementType = "academic" | "administrative" | "research";
type Priority = "low" | "medium" | "high";
type Status = "draft" | "published" | "scheduled";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: Priority;
  targetAudience: "students" | "staff" | "all";
  targetClassIds?: string[];
  status: Status;
  createdBy: User;
  createdAt: string;
  publishedAt?: string;
  views: number;
  recipients: number;
  attachments?: string[];
}

export default function Information() {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "academic" as AnnouncementType,
    priority: "medium" as Priority,
    targetAudience: "students" as "students" | "staff" | "all",
    targetClassIds: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teacher profile - assuming user ID is available from auth context
        const profileRes = await get(`${API_ENDPOINTS.LECTURER.TEACHER_PROFILES}1/`); // Replace with actual user ID
        setTeacherProfile(profileRes);

        // For now, keep mock data until announcements API is implemented
        setAnnouncements([]); // Replace with actual API call when available
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setAnnouncements([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case "academic":
        return <BookOpen className="h-4 w-4" />;
      case "administrative":
        return <Info className="h-4 w-4" />;
      case "research":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: AnnouncementType) => {
    switch (type) {
      case "academic":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "administrative":
        return "bg-green-100 text-green-700 border-green-200";
      case "research":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleCreateAnnouncement = () => {
    const announcement: Announcement = {
      id: `ann_${Date.now()}`,
      ...newAnnouncement,
      status: "draft",
      createdBy: teacherProfile ? {
        id: teacherProfile.id,
        username: teacherProfile.user.toString(),
        email: teacherProfile.email,
        phone: teacherProfile.phone,
        address: teacherProfile.address,
        gender: teacherProfile.gender,
        profile_image: teacherProfile.photo,
        is_verified: true,
        date_of_birth: teacherProfile.date_of_birth,
        created_at: teacherProfile.created_at,
        updated_at: teacherProfile.updated_at,
        first_name: teacherProfile.full_name.split(' ')[0] || '',
        last_name: teacherProfile.full_name.split(' ').slice(1).join(' ') || '',
        is_active: true,
        is_staff: false,
        is_superuser: false,
        last_login: new Date().toISOString(),
      } : {
        id: 2,
        username: "dara.sok",
        email: "dara.sok@example.edu",
        phone: "+855-12-345-679",
        address: "",
        gender: "male",
        profile_image: null,
        is_verified: true,
        date_of_birth: null,
        created_at: "2024-02-10T00:00:00Z",
        updated_at: "2025-10-23T14:20:00Z",
        first_name: "Dara",
        last_name: "Sok",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        last_login: "2025-10-23T14:20:00Z",
      },
      createdAt: new Date().toISOString(),
      views: 0,
      recipients: 0,
    };

    setAnnouncements(prev => [announcement, ...prev]);
    setNewAnnouncement({
      title: "",
      content: "",
      type: "academic",
      priority: "medium",
      targetAudience: "students",
      targetClassIds: [],
    });
    setIsCreateDialogOpen(false);
  };

  const handlePublishAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(ann =>
      ann.id === id
        ? { ...ann, status: "published", publishedAt: new Date().toISOString() }
        : ann
    ));
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading announcements..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Information & Announcements"
        description="Create and manage announcements for your students"
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" aria-label="Create new announcement">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Create New Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter announcement content"
                    rows={4}
                  />
                </div>

                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={newAnnouncement.type}
                      onValueChange={(value: AnnouncementType) =>
                        setNewAnnouncement(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={newAnnouncement.priority}
                      onValueChange={(value: Priority) =>
                        setNewAnnouncement(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Target Audience</Label>
                  <Select
                    value={newAnnouncement.targetAudience}
                    onValueChange={(value: "students" | "staff" | "all") =>
                      setNewAnnouncement(prev => ({ ...prev, targetAudience: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement} className="bg-blue-600 hover:bg-blue-700">
                    Create Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-all duration-300 border-blue-100 hover:border-blue-200 animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(announcement.type)}
                      <CardTitle className="text-blue-900">{announcement.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getTypeColor(announcement.type)}>
                        {announcement.type}
                      </Badge>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority} priority
                      </Badge>
                      <Badge className={getStatusColor(announcement.status)}>
                        {announcement.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAnnouncement(announcement)}
                      className="border-blue-200 hover:bg-blue-50"
                      aria-label={`View details for ${announcement.title}`}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    {announcement.status === "draft" && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishAnnouncement(announcement.id)}
                        className="bg-green-600 hover:bg-green-700"
                        aria-label={`Publish ${announcement.title}`}
                      >
                        <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                        Publish
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="border-red-200 hover:bg-red-50 text-red-600"
                      aria-label={`Delete ${announcement.title}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-blue-700 line-clamp-2">{announcement.content}</p>

                <div className="flex items-center justify-between text-sm text-blue-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {announcement.recipients} recipients
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {announcement.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span>Target: {announcement.targetAudience}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {announcements.filter(a => a.status === "published").map((announcement) => (
            <Card key={announcement.id} className="border-green-100 animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(announcement.type)}
                    <CardTitle className="text-blue-900">{announcement.title}</CardTitle>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Published
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">{announcement.content}</p>
                <div className="flex items-center gap-4 text-sm text-blue-600">
                  <span>Published: {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString() : 'N/A'}</span>
                  <span>{announcement.views} views</span>
                  <span>{announcement.recipients} recipients</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {announcements.filter(a => a.status === "draft").map((announcement) => (
            <Card key={announcement.id} className="border-gray-100 animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(announcement.type)}
                    <CardTitle className="text-blue-900">{announcement.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      Draft
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handlePublishAnnouncement(announcement.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">{announcement.content}</p>
                <div className="text-sm text-blue-600">
                  Created: {new Date(announcement.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {announcements.filter(a => a.status === "scheduled").map((announcement) => (
            <Card key={announcement.id} className="border-blue-100 animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(announcement.type)}
                    <CardTitle className="text-blue-900">{announcement.title}</CardTitle>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Scheduled
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {announcements.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No Announcements Yet</h3>
          <p className="text-blue-600 mb-4">Create your first announcement to communicate with your students.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700" aria-label="Create your first announcement">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Create Announcement
          </Button>
        </div>
      )}

      {/* Announcement Detail Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-900 flex items-center gap-2">
              {selectedAnnouncement && getTypeIcon(selectedAnnouncement.type)}
              {selectedAnnouncement?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getTypeColor(selectedAnnouncement.type)}>
                  {selectedAnnouncement.type}
                </Badge>
                <Badge className={getPriorityColor(selectedAnnouncement.priority)}>
                  {selectedAnnouncement.priority} priority
                </Badge>
                <Badge className={getStatusColor(selectedAnnouncement.status)}>
                  {selectedAnnouncement.status}
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  Target: {selectedAnnouncement.targetAudience}
                </Badge>
              </div>

              <div className="prose max-w-none">
                <p className="text-blue-700 whitespace-pre-wrap">{selectedAnnouncement.content}</p>
              </div>

              {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedAnnouncement.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className={`grid gap-4 text-sm ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Statistics</h4>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>{selectedAnnouncement.views} views</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{selectedAnnouncement.recipients} recipients</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Timeline</h4>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Created: {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}</span>
                    </p>
                    {selectedAnnouncement.publishedAt && (
                      <p className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-green-500" />
                        <span>Published: {new Date(selectedAnnouncement.publishedAt).toLocaleDateString()}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}