import { useState } from "react";
import { Save, Settings, Mail, Shield, Database, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface SystemSettings {
  university: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  academic: {
    current_semester: string;
    academic_year: string;
    semester_start: string;
    semester_end: string;
    qr_validity_minutes: number;
  };
  notifications: {
    email_enabled: boolean;
    sms_enabled: boolean;
    smtp_server: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
  };
  security: {
    session_timeout: number;
    password_min_length: number;
    require_special_chars: boolean;
    max_login_attempts: number;
  };
  attendance: {
    checkin_window_minutes: number;
    late_threshold_minutes: number;
    auto_checkout_enabled: boolean;
    teacher_required_for_students: boolean;
  };
}

export default function AdminSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    university: {
      name: "Cambodian University of Technology",
      address: "123 University Street, Phnom Penh, Cambodia",
      phone: "+855 23 123 456",
      email: "info@university.edu.kh",
      website: "https://university.edu.kh"
    },
    academic: {
      current_semester: "Spring 2024",
      academic_year: "2023-2024",
      semester_start: "2024-01-15",
      semester_end: "2024-05-15",
      qr_validity_minutes: 15
    },
    notifications: {
      email_enabled: true,
      sms_enabled: false,
      smtp_server: "smtp.gmail.com",
      smtp_port: 587,
      smtp_username: "",
      smtp_password: ""
    },
    security: {
      session_timeout: 60,
      password_min_length: 8,
      require_special_chars: true,
      max_login_attempts: 5
    },
    attendance: {
      checkin_window_minutes: 15,
      late_threshold_minutes: 5,
      auto_checkout_enabled: true,
      teacher_required_for_students: true
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // In real implementation, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure university system parameters</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <Tabs defaultValue="university" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="university">University</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="university" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                University Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university_name">University Name</Label>
                  <Input
                    id="university_name"
                    value={settings.university.name}
                    onChange={(e) => updateSetting('university', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university_email">Email</Label>
                  <Input
                    id="university_email"
                    type="email"
                    value={settings.university.email}
                    onChange={(e) => updateSetting('university', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university_phone">Phone</Label>
                  <Input
                    id="university_phone"
                    value={settings.university.phone}
                    onChange={(e) => updateSetting('university', 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university_website">Website</Label>
                  <Input
                    id="university_website"
                    value={settings.university.website}
                    onChange={(e) => updateSetting('university', 'website', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="university_address">Address</Label>
                <Textarea
                  id="university_address"
                  value={settings.university.address}
                  onChange={(e) => updateSetting('university', 'address', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Academic Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_semester">Current Semester</Label>
                  <Select
                    value={settings.academic.current_semester}
                    onValueChange={(value) => updateSetting('academic', 'current_semester', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                      <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                      <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                      <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input
                    id="academic_year"
                    value={settings.academic.academic_year}
                    onChange={(e) => updateSetting('academic', 'academic_year', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester_start">Semester Start Date</Label>
                  <Input
                    id="semester_start"
                    type="date"
                    value={settings.academic.semester_start}
                    onChange={(e) => updateSetting('academic', 'semester_start', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester_end">Semester End Date</Label>
                  <Input
                    id="semester_end"
                    type="date"
                    value={settings.academic.semester_end}
                    onChange={(e) => updateSetting('academic', 'semester_end', e.target.value)}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="qr_validity">QR Code Validity (minutes)</Label>
                <Input
                  id="qr_validity"
                  type="number"
                  min="5"
                  max="60"
                  value={settings.academic.qr_validity_minutes}
                  onChange={(e) => updateSetting('academic', 'qr_validity_minutes', parseInt(e.target.value))}
                />
                <p className="text-sm text-gray-600">
                  How long QR codes remain valid for attendance scanning
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send email notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email_enabled}
                    onCheckedChange={(checked) => updateSetting('notifications', 'email_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Send SMS notifications for critical alerts</p>
                  </div>
                  <Switch
                    checked={settings.notifications.sms_enabled}
                    onCheckedChange={(checked) => updateSetting('notifications', 'sms_enabled', checked)}
                  />
                </div>
              </div>

              {settings.notifications.email_enabled && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_server">SMTP Server</Label>
                      <Input
                        id="smtp_server"
                        value={settings.notifications.smtp_server}
                        onChange={(e) => updateSetting('notifications', 'smtp_server', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        type="number"
                        value={settings.notifications.smtp_port}
                        onChange={(e) => updateSetting('notifications', 'smtp_port', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_username">SMTP Username</Label>
                      <Input
                        id="smtp_username"
                        value={settings.notifications.smtp_username}
                        onChange={(e) => updateSetting('notifications', 'smtp_username', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_password">SMTP Password</Label>
                      <Input
                        id="smtp_password"
                        type="password"
                        value={settings.notifications.smtp_password}
                        onChange={(e) => updateSetting('notifications', 'smtp_password', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    min="15"
                    max="480"
                    value={settings.security.session_timeout}
                    onChange={(e) => updateSetting('security', 'session_timeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_min_length">Minimum Password Length</Label>
                  <Input
                    id="password_min_length"
                    type="number"
                    min="6"
                    max="20"
                    value={settings.security.password_min_length}
                    onChange={(e) => updateSetting('security', 'password_min_length', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.max_login_attempts}
                    onChange={(e) => updateSetting('security', 'max_login_attempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Special Characters</Label>
                  <p className="text-sm text-gray-600">Passwords must contain special characters</p>
                </div>
                <Switch
                  checked={settings.security.require_special_chars}
                  onCheckedChange={(checked) => updateSetting('security', 'require_special_chars', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin_window">Check-in Window (minutes)</Label>
                  <Input
                    id="checkin_window"
                    type="number"
                    min="5"
                    max="60"
                    value={settings.attendance.checkin_window_minutes}
                    onChange={(e) => updateSetting('attendance', 'checkin_window_minutes', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600">Time allowed before class starts</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="late_threshold">Late Threshold (minutes)</Label>
                  <Input
                    id="late_threshold"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.attendance.late_threshold_minutes}
                    onChange={(e) => updateSetting('attendance', 'late_threshold_minutes', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600">Minutes after start to be marked late</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Checkout</Label>
                    <p className="text-sm text-gray-600">Automatically check out students at class end</p>
                  </div>
                  <Switch
                    checked={settings.attendance.auto_checkout_enabled}
                    onCheckedChange={(checked) => updateSetting('attendance', 'auto_checkout_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Teacher Check-in Required</Label>
                    <p className="text-sm text-gray-600">Students can only check in after teacher starts session</p>
                  </div>
                  <Switch
                    checked={settings.attendance.teacher_required_for_students}
                    onCheckedChange={(checked) => updateSetting('attendance', 'teacher_required_for_students', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}