from django.db import models
from users.models import User

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    date_of_birth = models.DateField()
    national_id = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    # These fields are now ForeignKeys above, but keeping for compatibility
    department_name = models.CharField(max_length=255, blank=True)
    major_name = models.CharField(max_length=255, blank=True)
    class_name = models.CharField(max_length=100, blank=True)
    study_year = models.CharField(max_length=50, blank=True)
    semester = models.CharField(max_length=50, blank=True)
    photo = models.ImageField(upload_to='student_photos/', null=True, blank=True)
    transcript = models.FileField(upload_to='student_transcripts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    department = models.ForeignKey('admins.Department', on_delete=models.CASCADE, related_name='students')
    major = models.ForeignKey('admins.Major', on_delete=models.CASCADE, related_name='students')
    class_obj = models.ForeignKey('admins.Class', on_delete=models.CASCADE, related_name='students')
    academic_year = models.ForeignKey('core.AcademicYear', on_delete=models.SET_NULL, null=True, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Graduated', 'Graduated'), ('Suspended', 'Suspended'), ('Dropout', 'Dropout')])
    parent_name = models.CharField(max_length=255)
    parent_phone = models.CharField(max_length=20)
    enrollment_date = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"{self.full_name} - {self.class_name}"

class StudentAttendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('late', 'Late'),
        ('absent', 'Absent'),
    ]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    schedule = models.ForeignKey('lecturer.Schedule', on_delete=models.CASCADE)
    teacher_attendance = models.ForeignKey('lecturer.TeacherAttendance', on_delete=models.CASCADE, null=True)
    checkin_time = models.DateTimeField(null=True, blank=True)
    checkout_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='absent')
    created_at = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)
    verified_by = models.ForeignKey('users.StaffProfile', on_delete=models.SET_NULL, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.schedule.date} - {self.status}"
