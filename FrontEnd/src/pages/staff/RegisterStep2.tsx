import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, GraduationCap, Building2, School, Calendar, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useFetch } from "@/hooks/useFetch";
import { useResponsive } from "@/hooks/useResponsive";

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

const validationRules = {
  departmentId: [
    { required: true, message: 'Department selection is required' }
  ],
  majorId: [
    { required: true, message: 'Major selection is required' }
  ],
  classId: [
    { required: true, message: 'Class selection is required' }
  ],
  academicYear: [
    { required: true, message: 'Academic year is required' }
  ],
  semester: [
    { required: true, message: 'Semester is required' }
  ],
  shift: [
    { required: true, message: 'Study shift is required' }
  ],
  enrollmentDate: [
    { required: true, message: 'Enrollment date is required' }
  ]
};

export default function RegisterStep2() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const initialValues: AcademicInfo = {
    departmentId: '',
    majorId: '',
    classId: '',
    academicYear: '2024-2025',
    semester: '1',
    shift: 'Morning',
    enrollmentDate: new Date().toISOString().split('T')[0],
    scholarshipType: 'None'
  };

  const {
    values,
    errors,
    handleChange,
    validateForm,
    isValid
  } = useFormValidation(initialValues, validationRules);

  // Mock data - in real app, this would come from API
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

  // Filter majors based on selected department
  const availableMajors = majors.filter(major => major.departmentId === values.departmentId);

  // Filter classes based on selected major
  const availableClasses = classes.filter(cls => cls.majorId === values.majorId);

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (values.departmentId && !availableMajors.find(m => m.id === values.majorId)) {
      handleChange('majorId', '');
      handleChange('classId', '');
    }
  }, [values.departmentId, availableMajors, handleChange]);

  useEffect(() => {
    if (values.majorId && !availableClasses.find(c => c.id === values.classId)) {
      handleChange('classId', '');
    }
  }, [values.majorId, availableClasses, handleChange]);

  const handleNext = () => {
    if (validateForm()) {
      // Save to localStorage or context
      localStorage.setItem('registration_step2', JSON.stringify(values));
      navigate('/staff/register/step3');
    }
  };

  const handleBack = () => {
    navigate('/staff/register/step1');
  };

  const selectedClass = classes.find(c => c.id === values.classId);
  const capacityWarning = selectedClass && selectedClass.enrolled >= selectedClass.capacity * 0.9;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
        <p className="text-gray-600 mt-2">Step 2: Academic Information</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">Step 2 of 3</span>
          </div>
          <Progress value={66} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Personal Info</span>
            <span className="text-blue-600 font-medium">Academic Info</span>
            <span>Review & Confirm</span>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information Form */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* Academic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Department *
              </Label>
              <Select value={values.departmentId} onValueChange={(value) => handleChange('departmentId', value)}>
                <SelectTrigger className={errors.departmentId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-sm text-red-600">{errors.departmentId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="major" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Major *
              </Label>
              <Select
                value={values.majorId}
                onValueChange={(value) => handleChange('majorId', value)}
                disabled={!values.departmentId}
              >
                <SelectTrigger className={errors.majorId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select major" />
                </SelectTrigger>
                <SelectContent>
                  {availableMajors.map(major => (
                    <SelectItem key={major.id} value={major.id}>
                      {major.name} ({major.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.majorId && (
                <p className="text-sm text-red-600">{errors.majorId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                Class *
              </Label>
              <Select
                value={values.classId}
                onValueChange={(value) => handleChange('classId', value)}
                disabled={!values.majorId}
              >
                <SelectTrigger className={errors.classId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.enrolled}/{cls.capacity} enrolled)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classId && (
                <p className="text-sm text-red-600">{errors.classId}</p>
              )}
              {capacityWarning && selectedClass && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <p className="text-sm text-orange-800">
                    Class is near capacity ({selectedClass.enrolled}/{selectedClass.capacity})
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Enrollment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Select value={values.academicYear} onValueChange={(value) => handleChange('academicYear', value)}>
                  <SelectTrigger className={errors.academicYear ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                    <SelectItem value="2026-2027">2026-2027</SelectItem>
                  </SelectContent>
                </Select>
                {errors.academicYear && (
                  <p className="text-sm text-red-600">{errors.academicYear}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select value={values.semester} onValueChange={(value: '1' | '2') => handleChange('semester', value)}>
                  <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Semester</SelectItem>
                    <SelectItem value="2">2nd Semester</SelectItem>
                  </SelectContent>
                </Select>
                {errors.semester && (
                  <p className="text-sm text-red-600">{errors.semester}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Study Shift *</Label>
              <Select value={values.shift} onValueChange={(value: 'Morning' | 'Afternoon' | 'Evening') => handleChange('shift', value)}>
                <SelectTrigger className={errors.shift ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                  <SelectItem value="Afternoon">Afternoon (1:00 PM - 5:00 PM)</SelectItem>
                  <SelectItem value="Evening">Evening (5:30 PM - 9:30 PM)</SelectItem>
                </SelectContent>
              </Select>
              {errors.shift && (
                <p className="text-sm text-red-600">{errors.shift}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
              <input
                id="enrollmentDate"
                type="date"
                value={values.enrollmentDate}
                onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.enrollmentDate ? 'border-red-500' : 'border-gray-300'}`}
                title="Select enrollment date"
              />
              {errors.enrollmentDate && (
                <p className="text-sm text-red-600">{errors.enrollmentDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scholarshipType" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Scholarship Type
              </Label>
              <Select value={values.scholarshipType} onValueChange={(value) => handleChange('scholarshipType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Merit">Merit-based</SelectItem>
                  <SelectItem value="Need">Need-based</SelectItem>
                  <SelectItem value="Athletic">Athletic</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Information Preview */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Class Name</p>
                <p className="font-medium">{selectedClass.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-medium">{selectedClass.capacity} students</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrolled</p>
                <p className="font-medium">{selectedClass.enrolled} students</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className={`font-medium ${selectedClass.capacity - selectedClass.enrolled <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                  {selectedClass.capacity - selectedClass.enrolled} spots
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!isValid}>
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}