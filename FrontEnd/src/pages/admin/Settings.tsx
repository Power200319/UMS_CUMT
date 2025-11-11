import { useState, useEffect } from "react";
import { Save, TestTube, Database, Shield, Palette, Mail, Smartphone, Globe, Clock, Key, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_ENDPOINTS, get } from "@/api/config";
import type { SystemSettings } from "@/types";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: boolean | null }>({});
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [users, setUsers] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, usersRes] = await Promise.all([
          get(API_ENDPOINTS.ADMIN.SETTINGS),
          get(API_ENDPOINTS.ADMIN.USERS),
        ]);
        setSettings(settingsRes);
        setUsers(usersRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setSettings(null);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      setHasUnsavedChanges(false);
      // Show success message
    }, 500);
  };

  const handleTestConnection = (type: "smtp" | "sms") => {
    setTestResults(prev => ({ ...prev, [type]: null }));
    // Simulate connection test
    setTimeout(() => {
      setTestResults(prev => ({ ...prev, [type]: Math.random() > 0.3 })); // 70% success rate
    }, 2000);
  };

  const handleBackup = (type: "full" | "incremental") => {
    // Simulate backup
    console.log(`Starting ${type} backup`);
  };

  const handleRestore = (file: File) => {
    // Simulate restore
    console.log("Restoring from file:", file.name);
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="System Settings"
        description="Configure system-wide settings and preferences"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings" },
        ]}
        actions={
          <Button onClick={handleSaveSettings} disabled={!hasUnsavedChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        }
      />

      {hasUnsavedChanges && (
        <Alert className="mb-6">
          <AlertDescription>
            You have unsaved changes. Click "Save Changes" to apply them.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={settings.schoolName}
                  onChange={(e) => handleSettingChange("schoolName", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange("contactPhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Phnom_Penh">Asia/Phnom_Penh (ICT)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (ICT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="km">Khmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  min="6"
                  max="32"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange("passwordMinLength", parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="passwordRequireSpecialChar">Require Special Characters</Label>
                  <p className="text-sm text-muted-foreground">Passwords must contain at least one special character</p>
                </div>
                <Switch
                  id="passwordRequireSpecialChar"
                  checked={settings.passwordRequireSpecialChar}
                  onCheckedChange={(checked) => handleSettingChange("passwordRequireSpecialChar", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="otpEnabled">Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require OTP for admin accounts</p>
                </div>
                <Switch
                  id="otpEnabled"
                  checked={settings.otpEnabled}
                  onCheckedChange={(checked) => handleSettingChange("otpEnabled", checked)}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="15"
                  max="480"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => handleSettingChange("logo", e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                    className="w-16"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                    placeholder="#2563eb"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Layout customization options would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration (SMTP)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange("smtpHost", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange("smtpPort", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => handleSettingChange("smtpUser", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <div className="relative">
                  <Input
                    id="smtpPassword"
                    type={showPasswords.smtp ? "text" : "password"}
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange("smtpPassword", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("smtp")}
                  >
                    {showPasswords.smtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleTestConnection("smtp")}>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                {testResults.smtp !== undefined && (
                  <Badge variant={testResults.smtp ? "default" : "destructive"}>
                    {testResults.smtp ? "Success" : "Failed"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smsProvider">SMS Provider</Label>
                <Select value={settings.smsProvider} onValueChange={(value) => handleSettingChange("smsProvider", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="aws">AWS SNS</SelectItem>
                    <SelectItem value="messagebird">MessageBird</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="smsApiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="smsApiKey"
                    type={showPasswords.sms ? "text" : "password"}
                    value={settings.smsApiKey}
                    onChange={(e) => handleSettingChange("smsApiKey", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("sms")}
                  >
                    {showPasswords.sms ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleTestConnection("sms")}>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                {testResults.sms !== undefined && (
                  <Badge variant={testResults.sms ? "default" : "destructive"}>
                    {testResults.sms ? "Success" : "Failed"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={() => handleBackup("full")}>
                  <Database className="mr-2 h-4 w-4" />
                  Full Backup
                </Button>
                <Button variant="outline" onClick={() => handleBackup("incremental")}>
                  <Database className="mr-2 h-4 w-4" />
                  Incremental Backup
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Last backup: 2024-10-24 02:00 AM (2.3 GB)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restore from Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backupFile">Backup File</Label>
                <Input
                  id="backupFile"
                  type="file"
                  accept=".sql,.zip,.tar.gz"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleRestore(file);
                  }}
                />
              </div>
              <Alert>
                <AlertDescription>
                  <strong>Warning:</strong> Restoring from a backup will overwrite all current data.
                  Make sure you have a recent backup before proceeding.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Audit log configuration would be implemented here
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">Last active: 2 minutes ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}