import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, MapPin, Phone, Mail, FileText, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useResponsive } from "@/hooks/useResponsive";

interface TeacherApplication {
  full_name: string;
  gender: 'male' | 'female' | '';
  date_of_birth: string;
  nationality: string;
  place_of_birth: string;
  degree: string;
  major: string;
  institution: string;
  phone: string;
  email: string;
  experience: string;
  photo: File | null;
  cv: File | null;
  certificate: File | null;
}

const validationRules = {
  full_name: [
    { required: true, message: 'Full name is required' },
    { minLength: 2, message: 'Full name must be at least 2 characters' }
  ],
  gender: [
    { required: true, message: 'Gender is required' }
  ],
  date_of_birth: [
    { required: true, message: 'Date of birth is required' }
  ],
  nationality: [
    { required: true, message: 'Nationality is required' }
  ],
  place_of_birth: [
    { required: true, message: 'Place of birth is required' }
  ],
  degree: [
    { required: true, message: 'Degree is required' }
  ],
  major: [
    { required: true, message: 'Major is required' }
  ],
  institution: [
    { required: true, message: 'Institution is required' }
  ],
  phone: [
    { required: true, message: 'Phone number is required' },
    { pattern: /^(\+855|0)[1-9][0-9]{7,8}$/, message: 'Invalid Cambodian phone number' }
  ],
  email: [
    { required: true, message: 'Email is required' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
  ],
  experience: [
    { required: true, message: 'Experience is required' },
    { minLength: 10, message: 'Experience must be at least 10 characters' }
  ]
};

export default function TeacherRegistration() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const initialValues: TeacherApplication = {
    full_name: '',
    gender: '',
    date_of_birth: '',
    nationality: 'Cambodian',
    place_of_birth: '',
    degree: '',
    major: '',
    institution: '',
    phone: '',
    email: '',
    experience: '',
    photo: null,
    cv: null,
    certificate: null
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    isValid
  } = useFormValidation(initialValues, validationRules);

  const handleFileChange = (field: keyof TeacherApplication, file: File | null) => {
    handleChange(field, file);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });

      try {
        const response = await fetch('/api/lecturer/register/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Application submitted successfully!');
          navigate('/staff');
        } else {
          alert('Failed to submit application. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('An error occurred. Please try again.');
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
        <h1 className="text-3xl font-bold text-gray-900">Teacher Registration</h1>
        <p className="text-gray-600 mt-2">Apply to become a lecturer at our university</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Teacher Application Form
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
                <Label htmlFor="nationality">Nationality *</Label>
                <Select value={values.nationality} onValueChange={(value) => handleChange('nationality', value)}>
                  <SelectTrigger className={errors.nationality ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cambodian">Cambodian</SelectItem>
                    <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                    <SelectItem value="Thai">Thai</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nationality && (
                  <p className="text-sm text-red-600">{errors.nationality}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="place_of_birth" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Place of Birth *
                </Label>
                <Select value={values.place_of_birth} onValueChange={(value) => handleChange('place_of_birth', value)}>
                  <SelectTrigger className={errors.place_of_birth ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phnom Penh">Phnom Penh</SelectItem>
                    <SelectItem value="Siem Reap">Siem Reap</SelectItem>
                    <SelectItem value="Battambang">Battambang</SelectItem>
                    <SelectItem value="Kampong Cham">Kampong Cham</SelectItem>
                    <SelectItem value="Takeo">Takeo</SelectItem>
                    <SelectItem value="Kandal">Kandal</SelectItem>
                    <SelectItem value="Prey Veng">Prey Veng</SelectItem>
                    <SelectItem value="Svay Rieng">Svay Rieng</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.place_of_birth && (
                  <p className="text-sm text-red-600">{errors.place_of_birth}</p>
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
                <Label htmlFor="degree">Degree *</Label>
                <Select value={values.degree} onValueChange={(value) => handleChange('degree', value)}>
                  <SelectTrigger className={errors.degree ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.degree && (
                  <p className="text-sm text-red-600">{errors.degree}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study *</Label>
                <Input
                  id="major"
                  value={values.major}
                  onChange={(e) => handleChange('major', e.target.value)}
                  onBlur={() => handleBlur('major')}
                  placeholder="e.g., Computer Science"
                  className={errors.major ? 'border-red-500' : ''}
                />
                {errors.major && (
                  <p className="text-sm text-red-600">{errors.major}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={values.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  onBlur={() => handleBlur('institution')}
                  placeholder="University/College name"
                  className={errors.institution ? 'border-red-500' : ''}
                />
                {errors.institution && (
                  <p className="text-sm text-red-600">{errors.institution}</p>
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
                  placeholder="teacher@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </h3>
              <div className="space-y-2">
                <Label htmlFor="experience">Teaching Experience *</Label>
                <Textarea
                  id="experience"
                  value={values.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  onBlur={() => handleBlur('experience')}
                  placeholder="Describe your teaching experience..."
                  rows={4}
                  className={errors.experience ? 'border-red-500' : ''}
                />
                {errors.experience && (
                  <p className="text-sm text-red-600">{errors.experience}</p>
                )}
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4 col-span-full">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </h3>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                <div className="space-y-2">
                  <Label htmlFor="photo">Portrait Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cv">Curriculum Vitae (CV)</Label>
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('cv', e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificate">Degree Certificate</Label>
                  <Input
                    id="certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('certificate', e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid}>
          Submit Application
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}