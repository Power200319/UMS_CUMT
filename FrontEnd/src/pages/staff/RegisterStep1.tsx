import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useResponsive } from "@/hooks/useResponsive";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  firstNameKhmer: string;
  lastNameKhmer: string;
  gender: 'Male' | 'Female' | '';
  dateOfBirth: string;
  nationality: string;
  placeOfBirth: string;
  phone: string;
  email: string;
  address: string;
  idCardNumber: string;
}

const validationRules = {
  firstName: [
    { required: true, message: 'First name is required' },
    { minLength: 2, message: 'First name must be at least 2 characters' }
  ],
  lastName: [
    { required: true, message: 'Last name is required' },
    { minLength: 2, message: 'Last name must be at least 2 characters' }
  ],
  firstNameKhmer: [
    { required: true, message: 'Khmer first name is required' }
  ],
  lastNameKhmer: [
    { required: true, message: 'Khmer last name is required' }
  ],
  gender: [
    { required: true, message: 'Gender is required' }
  ],
  dateOfBirth: [
    { required: true, message: 'Date of birth is required' }
  ],
  nationality: [
    { required: true, message: 'Nationality is required' }
  ],
  placeOfBirth: [
    { required: true, message: 'Place of birth is required' }
  ],
  phone: [
    { required: true, message: 'Phone number is required' },
    { pattern: /^(\+855|0)[1-9][0-9]{7,8}$/, message: 'Invalid Cambodian phone number' }
  ],
  email: [
    { required: true, message: 'Email is required' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
  ],
  address: [
    { required: true, message: 'Address is required' },
    { minLength: 10, message: 'Address must be at least 10 characters' }
  ],
  idCardNumber: [
    { required: true, message: 'ID card number is required' },
    { pattern: /^[0-9]{9,10}$/, message: 'ID card number must be 9-10 digits' }
  ]
};

export default function RegisterStep1() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const initialValues: PersonalInfo = {
    firstName: '',
    lastName: '',
    firstNameKhmer: '',
    lastNameKhmer: '',
    gender: '',
    dateOfBirth: '',
    nationality: 'Cambodian',
    placeOfBirth: '',
    phone: '',
    email: '',
    address: '',
    idCardNumber: ''
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    isValid
  } = useFormValidation(initialValues, validationRules);

  const handleNext = () => {
    if (validateForm()) {
      // Save to localStorage or context
      localStorage.setItem('registration_step1', JSON.stringify(values));
      navigate('/staff/register/step2');
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
        <p className="text-gray-600 mt-2">Step 1: Personal Information</p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">Step 1 of 3</span>
          </div>
          <Progress value={33} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span className="text-blue-600 font-medium">Personal Info</span>
            <span>Academic Info</span>
            <span>Review & Confirm</span>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {/* English Name */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">English Name</h3>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={values.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  placeholder="Enter first name"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={values.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Enter last name"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Khmer Name */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Khmer Name</h3>
              <div className="space-y-2">
                <Label htmlFor="firstNameKhmer">First Name (Khmer) *</Label>
                <Input
                  id="firstNameKhmer"
                  value={values.firstNameKhmer}
                  onChange={(e) => handleChange('firstNameKhmer', e.target.value)}
                  onBlur={() => handleBlur('firstNameKhmer')}
                  placeholder="នាមខ្លួន"
                  className={errors.firstNameKhmer ? 'border-red-500' : ''}
                />
                {errors.firstNameKhmer && (
                  <p className="text-sm text-red-600">{errors.firstNameKhmer}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastNameKhmer">Last Name (Khmer) *</Label>
                <Input
                  id="lastNameKhmer"
                  value={values.lastNameKhmer}
                  onChange={(e) => handleChange('lastNameKhmer', e.target.value)}
                  onBlur={() => handleBlur('lastNameKhmer')}
                  placeholder="នាមត្រកូល"
                  className={errors.lastNameKhmer ? 'border-red-500' : ''}
                />
                {errors.lastNameKhmer && (
                  <p className="text-sm text-red-600">{errors.lastNameKhmer}</p>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={values.gender} onValueChange={(value: 'Male' | 'Female') => handleChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={values.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  onBlur={() => handleBlur('dateOfBirth')}
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
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
            </div>

            {/* Place of Birth */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Place of Birth *
                </Label>
                <Select value={values.placeOfBirth} onValueChange={(value) => handleChange('placeOfBirth', value)}>
                  <SelectTrigger className={errors.placeOfBirth ? 'border-red-500' : ''}>
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
                {errors.placeOfBirth && (
                  <p className="text-sm text-red-600">{errors.placeOfBirth}</p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
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
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
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
            </div>

            {/* Address and ID */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={values.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  placeholder="Enter full address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="idCardNumber">ID Card Number *</Label>
                <Input
                  id="idCardNumber"
                  value={values.idCardNumber}
                  onChange={(e) => handleChange('idCardNumber', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('idCardNumber')}
                  placeholder="123456789"
                  maxLength={10}
                  className={errors.idCardNumber ? 'border-red-500' : ''}
                />
                {errors.idCardNumber && (
                  <p className="text-sm text-red-600">{errors.idCardNumber}</p>
                )}
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
        <Button onClick={handleNext} disabled={!isValid}>
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}