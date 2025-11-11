import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Building2, GraduationCap, Camera, Save, Edit, X } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS, get } from "@/api/config";
import type { User as UserType, TeacherProfile } from "@/types";

type LecturerProfile = TeacherProfile;

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);

  // Mock lecturer profile data based on TeacherProfile model
  const mockProfile: TeacherProfile = {
    id: 1,
    user: 1,
    full_name: "Dara Sok",
    gender: "male",
    date_of_birth: "1985-05-15",
    nationality: "Cambodian",
    place_of_birth: "Phnom Penh",
    degree: "PhD in Computer Science",
    major_name: "Computer Science",
    institution: "Royal University of Phnom Penh",
    phone: "+855-12-345-679",
    email: "dara.sok@example.edu",
    experience: "8 years in software engineering and data science",
    photo: null,
    cv: null,
    certificate: null,
    created_at: "2017-08-15T00:00:00Z",
    department: 1,
    major: 1,
    is_active: true,
    hire_date: "2017-08-15",
    updated_at: "2025-10-23T14:20:00Z",
    address: "Phnom Penh, Cambodia",
    emergency_contact: "Sophia Sok",
    bio: "Senior lecturer specializing in software engineering and data science with 8 years of experience.",
  };

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch teacher profile - assuming user ID is available from auth context
        const profileRes = await get(`${API_ENDPOINTS.LECTURER.TEACHER_PROFILES}1/`); // Replace with actual user ID
        setProfile(profileRes);
        setFormData({
          full_name: profileRes.full_name,
          email: profileRes.email,
          phone: profileRes.phone,
          address: profileRes.address,
          bio: profileRes.bio || "",
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fallback to mock data
        setProfile(mockProfile);
        setFormData({
          full_name: mockProfile.full_name,
          email: mockProfile.email,
          phone: mockProfile.phone,
          address: mockProfile.address,
          bio: mockProfile.bio || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = () => {
    if (!profile) return;

    // Simulate API call
    const updatedProfile = {
      ...profile,
      user: {
        ...profile.user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      officeLocation: formData.officeLocation,
      officeHours: formData.officeHours,
      researchInterests: formData.researchInterests.split(",").map(s => s.trim()),
      languages: formData.languages.split(",").map(s => s.trim()),
    };

    setProfile(updatedProfile);
    setIsEditing(false);
    // Show success toast
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    // Simulate API call
    setIsPasswordDialogOpen(false);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    // Show success toast
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your personal and professional information"
        actions={
          <div className="flex gap-2">
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4">
              <Avatar className="w-24 h-24 mx-auto border-4 border-blue-100">
                <AvatarImage src={profile.user.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                  {profile.user.firstName[0]}{profile.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full bg-white border-blue-200 hover:bg-blue-50"
                >
                  <Camera className="h-4 w-4 text-blue-600" />
                </Button>
              )}
            </div>
            <CardTitle className="text-blue-900">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="text-center"
                  />
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="text-center"
                  />
                </div>
              ) : (
                `${profile.user.firstName} ${profile.user.lastName}`
              )}
            </CardTitle>
            <p className="text-blue-600">{profile.position}</p>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {profile.employeeId}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>{profile.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span>{profile.specialization}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-blue-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-blue-50">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span>{profile.user.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-blue-50">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>{profile.user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-blue-900">Professional Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Office Location</Label>
                  {isEditing ? (
                    <Input
                      value={formData.officeLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, officeLocation: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-blue-50">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{profile.officeLocation}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Office Hours</Label>
                  {isEditing ? (
                    <Input
                      value={formData.officeHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, officeHours: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-blue-50">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{profile.officeHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-blue-900">Academic Information</h3>

              <div className="space-y-2">
                <Label>Qualifications</Label>
                <div className="space-y-1">
                  {profile.qualifications.map((qual, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-1 border-blue-200 text-blue-700">
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Research Interests</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.researchInterests}
                      onChange={(e) => setFormData(prev => ({ ...prev, researchInterests: e.target.value }))}
                      placeholder="Separate with commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {profile.researchInterests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Languages</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.languages}
                      onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                      placeholder="Separate with commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {profile.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.experience}</div>
                  <div className="text-sm text-blue-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.publications}</div>
                  <div className="text-sm text-blue-600">Publications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">4.2</div>
                  <div className="text-sm text-blue-600">Teaching Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-blue-600">Attendance Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}