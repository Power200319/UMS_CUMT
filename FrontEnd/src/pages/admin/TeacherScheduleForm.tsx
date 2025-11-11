import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormValidation } from "@/hooks/useFormValidation";

interface ScheduleForm {
  teacher_id: string;
  subject: string;
  class_name: string;
  room: string;
  date: string;
  start_time: string;
  end_time: string;
}

const validationRules = {
  teacher_id: [{ required: true, message: 'Teacher is required' }],
  subject: [{ required: true, message: 'Subject is required' }],
  class_name: [{ required: true, message: 'Class name is required' }],
  room: [{ required: true, message: 'Room is required' }],
  date: [{ required: true, message: 'Date is required' }],
  start_time: [{ required: true, message: 'Start time is required' }],
  end_time: [{ required: true, message: 'End time is required' }],
};

export default function TeacherScheduleForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues: ScheduleForm = {
    teacher_id: '',
    subject: '',
    class_name: '',
    room: '',
    date: '',
    start_time: '',
    end_time: '',
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    isValid
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch('/api/lecturer/schedules/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          alert(`Schedule created successfully! QR Token: ${data.qr_token}`);
          navigate('/admin/teacher-schedules');
        } else {
          alert('Failed to create schedule.');
        }
      } catch (error) {
        console.error('Error creating schedule:', error);
        alert('An error occurred.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/teacher-schedules')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schedules
        </Button>
        <h1 className="text-3xl font-bold">Create Teacher Schedule</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="teacher_id">Teacher *</Label>
              <Select value={values.teacher_id} onValueChange={(value) => handleChange('teacher_id', value)}>
                <SelectTrigger className={errors.teacher_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {/* This would be populated from API */}
                  <SelectItem value="1">John Doe</SelectItem>
                  <SelectItem value="2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
              {errors.teacher_id && (
                <p className="text-sm text-red-600">{errors.teacher_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={values.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                onBlur={() => handleBlur('subject')}
                placeholder="e.g., Computer Science"
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject}</p>
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

            <div className="space-y-2">
              <Label htmlFor="room">Room *</Label>
              <Input
                id="room"
                value={values.room}
                onChange={(e) => handleChange('room', e.target.value)}
                onBlur={() => handleBlur('room')}
                placeholder="e.g., Room 101"
                className={errors.room ? 'border-red-500' : ''}
              />
              {errors.room && (
                <p className="text-sm text-red-600">{errors.room}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={values.date}
                onChange={(e) => handleChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={values.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                onBlur={() => handleBlur('start_time')}
                className={errors.start_time ? 'border-red-500' : ''}
              />
              {errors.start_time && (
                <p className="text-sm text-red-600">{errors.start_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={values.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
                onBlur={() => handleBlur('end_time')}
                className={errors.end_time ? 'border-red-500' : ''}
              />
              {errors.end_time && (
                <p className="text-sm text-red-600">{errors.end_time}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={!isValid || loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Schedule'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}