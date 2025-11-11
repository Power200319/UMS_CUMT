import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, MapPin, Phone, Mail, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useResponsive } from "@/hooks/useResponsive";

interface StudentForm {
  full_name: string;
  gender: 'male' | 'female' | '';
  date_of_birth: string;
  national_id: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  major: string;
  class_name: string;
  study_year: string;
  semester: string;
  photo: File | null;
  transcript: File | null;
}

const validationRules = {
  full_name: [{ required: true, message: 'Full name is required' }, { minLength: 2, message: 'Full name must be at least 2 characters' }],
  gender: [{ required: true, message: 'Gender is required' }],
  date_of_birth: [{ required: true, message: 'Date of birth is required' }],
  national_id: [{ required: true, message: 'National ID is required' }, { pattern: /^[0-9]{9,10}$/, message: 'National ID must be 9-10 digits' }],
  phone: [{ required: true, message: 'Phone number is required' }, { pattern: /^(\+855|0)[1-9][0-9]{7,8}$/, message: 'Invalid Cambodian phone number' }],
  email: [{ required: true, message: 'Email is required' }, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }],
  address: [{ required: true, message: 'Address is required' }, { minLength: 10, message: 'Address must be at least 10 characters' }],
  department: [{ required: true, message: 'Department is required' }],
  major: [{ required: true, message: 'Major is required' }],
  class_name: [{ required: true, message: 'Class name is required' }],
  study_year: [{ required: true, message: 'Study year is required' }],
  semester: [{ required: true, message: 'Semester is required' }],
};

export default function StudentRegistration() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false);

  const initialValues: StudentForm = {
    full_name: '',
    gender: '',
    date_of_birth: '',
    national_id: '',
    phone: '',
    email: '',
    address: '',
    department: '',
    major: '',
    class_name: '',
    study_year: '',
    semester: '',
    photo: null,
    transcript: null,
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    isValid
  } = useFormValidation(initialValues, validationRules);

  const handleFileChange = (field: keyof StudentForm, file: File | null) => {
    handleChange(field, file);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== null && value !== '') {
            formData.append(key, value.toString());
          }
        });

        const response = await fetch('/api/student/create/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          alert(`Student created successfully!\nUsername: ${data.username}\nPassword: ${data.password}`);
          navigate('/staff');
        } else {
          alert('Failed to create student.');
        }
      } catch (error) {
        console.error('Error creating student:', error);
        alert('An error occurred.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/staff');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
        <p className="text-gray-600 mt-2">Create student account and profile</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={values.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  onBlur={() => handleBlur('full_name')}
                  placeholder="Enter full name"
                  className={errors.full_name ? 'border-red-500' : ''}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={values.gender} onValueChange={(value: 'male' | 'female') => handleChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={values.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  onBlur={() => handleBlur('date_of_birth')}
                  className={errors.date_of_birth ? 'border-red-500' : ''}
                />
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600">{errors.date_of_birth}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="national_id">National ID *</Label>
                <Input
                  id="national_id"
                  value={values.national_id}
                  onChange={(e) => handleChange('national_id', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('national_id')}
                  placeholder="123456789"
                  maxLength={10}
                  className={errors.national_id ? 'border-red-500' : ''}
                />
                {errors.national_id && (
                  <p className="text-sm text-red-600">{errors.national_id}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={values.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+855 XX XXX XXX"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="student@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={values.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  placeholder="Enter full address"
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={values.department} onValueChange={(value) => handleChange('department', value)}>
                  <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-600">{errors.department}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major *</Label>
                <Input
                  id="major"
                  value={values.major}
                  onChange={(e) => handleChange('major', e.target.value)}
                  onBlur={() => handleBlur('major')}
                  placeholder="e.g., Software Engineering"
                  className={errors.major ? 'border-red-500' : ''}
                />
                {errors.major && (
                  <p className="text-sm text-red-600">{errors.major}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="class_name">Class Name *</Label>
                <Input
                  id="class_name"
                  value={values.class_name}
                  onChange={(e) => handleChange('class_name', e.target.value)}
                  onBlur={() => handleBlur('class_name')}
                  placeholder="e.g., CS101"
                  className={errors.class_name ? 'border-red-500' : ''}
                />
                {errors.class_name && (
                  <p className="text-sm text-red-600">{errors.class_name}</p>
                )}
              </div>
            </div>

            {/* Study Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Study Information</h3>
              <div className="space-y-2">
                <Label htmlFor="study_year">Study Year *</Label>
                <Select value={values.study_year} onValueChange={(value) => handleChange('study_year', value)}>
                  <SelectTrigger className={errors.study_year ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                    <SelectItem value="5">Year 5</SelectItem>
                  </SelectContent>
                </Select>
                {errors.study_year && (
                  <p className="text-sm text-red-600">{errors.study_year}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select value={values.semester} onValueChange={(value) => handleChange('semester', value)}>
                  <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
                {errors.semester && (
                  <p className="text-sm text-red-600">{errors.semester}</p>
                )}
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4 col-span-full">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </h3>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="space-y-2">
                  <Label htmlFor="photo">Profile Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transcript">Academic Transcript</Label>
                  <Input
                    id="transcript"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('transcript', e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={!isValid || loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Student Account'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}