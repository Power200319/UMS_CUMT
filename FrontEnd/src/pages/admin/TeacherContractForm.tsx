import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormValidation } from "@/hooks/useFormValidation";

interface ContractForm {
  teacher_id: string;
  subject: string;
  department: string;
  salary: string;
  contract_start: string;
  contract_end: string;
  working_days: string[];
  conditions: string;
}

const validationRules = {
  teacher_id: [{ required: true, message: 'Teacher is required' }],
  subject: [{ required: true, message: 'Subject is required' }],
  department: [{ required: true, message: 'Department is required' }],
  salary: [{ required: true, message: 'Salary is required' }, { pattern: /^\d+(\.\d{1,2})?$/, message: 'Invalid salary format' }],
  contract_start: [{ required: true, message: 'Contract start date is required' }],
  contract_end: [{ required: true, message: 'Contract end date is required' }],
};

export default function TeacherContractForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues: ContractForm = {
    teacher_id: '',
    subject: '',
    department: '',
    salary: '',
    contract_start: '',
    contract_end: '',
    working_days: [],
    conditions: '',
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    isValid
  } = useFormValidation(initialValues, validationRules);

  const handleWorkingDaysChange = (day: string, checked: boolean) => {
    const currentDays = values.working_days || [];
    let newDays: string[];
    if (checked) {
      newDays = [...currentDays, day];
    } else {
      newDays = currentDays.filter(d => d !== day);
    }
    handleChange('working_days', newDays);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch('/api/lecturer/contracts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            salary: parseFloat(values.salary),
          }),
        });

        if (response.ok) {
          alert('Contract created successfully!');
          navigate('/admin/teacher-contracts');
        } else {
          alert('Failed to create contract.');
        }
      } catch (error) {
        console.error('Error creating contract:', error);
        alert('An error occurred.');
      } finally {
        setLoading(false);
      }
    }
  };

  const workingDaysOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/teacher-contracts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contracts
        </Button>
        <h1 className="text-3xl font-bold">Create Teacher Contract</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
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
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={values.department}
                onChange={(e) => handleChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                placeholder="e.g., Faculty of Science"
                className={errors.department ? 'border-red-500' : ''}
              />
              {errors.department && (
                <p className="text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary (per month) *</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                value={values.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                onBlur={() => handleBlur('salary')}
                placeholder="0.00"
                className={errors.salary ? 'border-red-500' : ''}
              />
              {errors.salary && (
                <p className="text-sm text-red-600">{errors.salary}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_start">Contract Start Date *</Label>
              <Input
                id="contract_start"
                type="date"
                value={values.contract_start}
                onChange={(e) => handleChange('contract_start', e.target.value)}
                onBlur={() => handleBlur('contract_start')}
                className={errors.contract_start ? 'border-red-500' : ''}
              />
              {errors.contract_start && (
                <p className="text-sm text-red-600">{errors.contract_start}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_end">Contract End Date *</Label>
              <Input
                id="contract_end"
                type="date"
                value={values.contract_end}
                onChange={(e) => handleChange('contract_end', e.target.value)}
                onBlur={() => handleBlur('contract_end')}
                className={errors.contract_end ? 'border-red-500' : ''}
              />
              {errors.contract_end && (
                <p className="text-sm text-red-600">{errors.contract_end}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Working Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {workingDaysOptions.map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={values.working_days?.includes(day) || false}
                      onChange={(e) => handleWorkingDaysChange(day, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="conditions">Additional Conditions</Label>
              <Textarea
                id="conditions"
                value={values.conditions}
                onChange={(e) => handleChange('conditions', e.target.value)}
                placeholder="Any additional terms or conditions..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={!isValid || loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Contract'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}