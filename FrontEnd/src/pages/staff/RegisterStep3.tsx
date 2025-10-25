import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle, User, GraduationCap, FileText, Printer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotifications } from "@/contexts/NotificationContext";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  firstNameKhmer: string;
  lastNameKhmer: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  nationality: string;
  placeOfBirth: string;
  phone: string;
  email: string;
  address: string;
  idCardNumber: string;
}

interface AcademicInfo {
  departmentId: string;
  majorId: string;
  classId: string;
  academicYear: string;
  semester: '1' | '2';
  shift: 'Morning' | 'Afternoon' | 'Evening';
  enrollmentDate: string;
  scholarshipType: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Major {
  id: string;
  name: string;
  code: string;
  departmentId: string;
}

interface Class {
  id: string;
  name: string;
  code: string;
  majorId: string;
  capacity: number;
  enrolled: number;
}

export default function RegisterStep3() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo | null>(null);

  // Mock data
  const departments: Department[] = [
    { id: 'dept_1', name: 'Computer Science', code: 'CS' },
    { id: 'dept_2', name: 'Business Administration', code: 'BA' },
    { id: 'dept_3', name: 'Engineering', code: 'ENG' },
    { id: 'dept_4', name: 'Arts & Humanities', code: 'AH' }
  ];

  const majors: Major[] = [
    { id: 'maj_1', name: 'Software Engineering', code: 'SE', departmentId: 'dept_1' },
    { id: 'maj_2', name: 'Data Science', code: 'DS', departmentId: 'dept_1' },
    { id: 'maj_3', name: 'Computer Networks', code: 'CN', departmentId: 'dept_1' },
    { id: 'maj_4', name: 'Business Management', code: 'BM', departmentId: 'dept_2' },
    { id: 'maj_5', name: 'Accounting', code: 'ACC', departmentId: 'dept_2' },
    { id: 'maj_6', name: 'Marketing', code: 'MKT', departmentId: 'dept_2' },
    { id: 'maj_7', name: 'Civil Engineering', code: 'CE', departmentId: 'dept_3' },
    { id: 'maj_8', name: 'Mechanical Engineering', code: 'ME', departmentId: 'dept_3' },
    { id: 'maj_9', name: 'English Literature', code: 'EL', departmentId: 'dept_4' },
    { id: 'maj_10', name: 'History', code: 'HIS', departmentId: 'dept_4' }
  ];

  const classes: Class[] = [
    { id: 'class_1', name: 'CS-2025-A', code: 'CS-2025-A', majorId: 'maj_1', capacity: 30, enrolled: 28 },
    { id: 'class_2', name: 'CS-2025-B', code: 'CS-2025-B', majorId: 'maj_1', capacity: 30, enrolled: 25 },
    { id: 'class_3', name: 'DS-2025-A', code: 'DS-2025-A', majorId: 'maj_2', capacity: 25, enrolled: 22 },
    { id: 'class_4', name: 'BM-2025-A', code: 'BM-2025-A', majorId: 'maj_4', capacity: 35, enrolled: 32 },
    { id: 'class_5', name: 'CE-2025-A', code: 'CE-2025-A', majorId: 'maj_7', capacity: 28, enrolled: 26 }
  ];

  useEffect(() => {
    // Load data from localStorage
    const step1Data = localStorage.getItem('registration_step1');
    const step2Data = localStorage.getItem('registration_step2');

    if (step1Data) {
      setPersonalInfo(JSON.parse(step1Data));
    } else {
      navigate('/staff/register/step1');
    }

    if (step2Data) {
      setAcademicInfo(JSON.parse(step2Data));
    } else {
      navigate('/staff/register/step2');
    }
  }, [navigate]);

  const handleConfirmRegistration = async () => {
    if (!personalInfo || !academicInfo) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful registration
      const studentId = `STU${Date.now()}`;

      // Add notification
      addNotification({
        title: 'Student Registration Successful',
        message: `${personalInfo.firstName} ${personalInfo.lastName} has been registered with ID: ${studentId}`,
        type: 'success'
      });

      // Clear stored data
      localStorage.removeItem('registration_step1');
      localStorage.removeItem('registration_step2');

      // Navigate to success page or student profile
      navigate('/staff', {
        state: {
          success: true,
          studentId,
          studentName: `${personalInfo.firstName} ${personalInfo.lastName}`
        }
      });

    } catch (error) {
      addNotification({
        title: 'Registration Failed',
        message: 'An error occurred during registration. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/staff/register/step2');
  };

  const handlePrintPreview = () => {
    // In a real app, this would open a print dialog or generate a PDF
    window.print();
  };

  if (!personalInfo || !academicInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration data...</p>
        </div>
      </div>
    );
  }

  const selectedDepartment = departments.find(d => d.id === academicInfo.departmentId);
  const selectedMajor = majors.find(m => m.id === academicInfo.majorId);
  const selectedClass = classes.find(c => c.id === academicInfo.classId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
        <p className="text-gray-600 mt-2">Step 3: Review & Confirm</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">Step 3 of 3</span>
          </div>
          <Progress value={100} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Personal Info</span>
            <span>Academic Info</span>
            <span className="text-blue-600 font-medium">Review & Confirm</span>
          </div>
        </CardContent>
      </Card>

      {/* Review Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name (English)</p>
                <p className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Name (Khmer)</p>
                <p className="font-medium">{personalInfo.firstNameKhmer} {personalInfo.lastNameKhmer}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{personalInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{new Date(personalInfo.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nationality</p>
                <p className="font-medium">{personalInfo.nationality}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Place of Birth</p>
                <p className="font-medium">{personalInfo.placeOfBirth}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-600">Contact Information</p>
              <div className="mt-1 space-y-1">
                <p className="font-medium">📞 {personalInfo.phone}</p>
                <p className="font-medium">✉️ {personalInfo.email}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{personalInfo.address}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">ID Card Number</p>
              <p className="font-medium">{personalInfo.idCardNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{selectedDepartment?.name} ({selectedDepartment?.code})</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Major</p>
              <p className="font-medium">{selectedMajor?.name} ({selectedMajor?.code})</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Class</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{selectedClass?.name}</p>
                <Badge variant="outline">
                  {selectedClass?.enrolled}/{selectedClass?.capacity} enrolled
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Academic Year</p>
                <p className="font-medium">{academicInfo.academicYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Semester</p>
                <p className="font-medium">{academicInfo.semester === '1' ? '1st Semester' : '2nd Semester'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Study Shift</p>
                <p className="font-medium">{academicInfo.shift}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrollment Date</p>
                <p className="font-medium">{new Date(academicInfo.enrollmentDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Scholarship</p>
              <p className="font-medium">
                {academicInfo.scholarshipType === 'None' ? 'No scholarship' : academicInfo.scholarshipType}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Please review all information carefully. Once confirmed, the student registration cannot be easily modified.
          Make sure all details are accurate before proceeding.
        </AlertDescription>
      </Alert>

      {/* Registration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{personalInfo.firstName} {personalInfo.lastName}</p>
              <p className="text-sm text-gray-600">Student Name</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{selectedMajor?.code}</p>
              <p className="text-sm text-gray-600">Major</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{selectedClass?.name}</p>
              <p className="text-sm text-gray-600">Class</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintPreview}>
            <Printer className="mr-2 h-4 w-4" />
            Print Preview
          </Button>

          <Button
            onClick={handleConfirmRegistration}
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registering...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Registration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}