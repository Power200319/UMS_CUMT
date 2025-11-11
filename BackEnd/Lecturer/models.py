from django.db import models
from users.models import User

class TeacherApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=100)
    place_of_birth = models.CharField(max_length=255)
    degree = models.CharField(max_length=100)
    major_name = models.CharField(max_length=255, blank=True)
    institution = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    experience = models.TextField()
    photo = models.ImageField(upload_to='teacher_photos/')
    cv = models.FileField(upload_to='teacher_cvs/')
    certificate = models.FileField(upload_to='teacher_certificates/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_by = models.ForeignKey('users.StaffProfile', on_delete=models.SET_NULL, null=True, blank=True)
    review_comment = models.TextField(blank=True)
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    resume_text = models.TextField(blank=True)

    def __str__(self):
        return f"{self.full_name} - {self.status}"

class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=100)
    place_of_birth = models.CharField(max_length=255)
    degree = models.CharField(max_length=100)
    major_name = models.CharField(max_length=255, blank=True)
    institution = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    experience = models.TextField()
    photo = models.ImageField(upload_to='teacher_photos/')
    cv = models.FileField(upload_to='teacher_cvs/')
    certificate = models.FileField(upload_to='teacher_certificates/')
    created_at = models.DateTimeField(auto_now_add=True)
    department = models.ForeignKey('admins.Department', on_delete=models.CASCADE)
    major = models.ForeignKey('admins.Major', on_delete=models.CASCADE, related_name='teacher_profiles')
    is_active = models.BooleanField(default=True)
    hire_date = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)
    address = models.TextField()
    emergency_contact = models.CharField(max_length=255)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.full_name

class Contract(models.Model):
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    subject = models.ForeignKey('admins.Subject', on_delete=models.CASCADE)
    department = models.ForeignKey('admins.Department', on_delete=models.CASCADE)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    contract_start = models.DateField()
    contract_end = models.DateField()
    working_days = models.JSONField()  # List of working days
    conditions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    contract_type = models.CharField(max_length=50, choices=[('Full-time', 'Full-time'), ('Part-time', 'Part-time')])
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Ended', 'Ended'), ('Pending', 'Pending')])
    updated_at = models.DateTimeField(auto_now=True)
    approved_by = models.ForeignKey('users.StaffProfile', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.teacher.full_name} - {self.subject}"

class Schedule(models.Model):
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    subject = models.ForeignKey('admins.Subject', on_delete=models.CASCADE)
    class_obj = models.ForeignKey('admins.Class', on_delete=models.CASCADE)
    room = models.CharField(max_length=100)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    qr_code_token = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=False)  # Activated when teacher checks in
    created_at = models.DateTimeField(auto_now_add=True)
    shift = models.CharField(max_length=20, choices=[('Morning', 'Morning'), ('Afternoon', 'Afternoon'), ('Evening', 'Evening')])
    academic_year = models.ForeignKey('core.AcademicYear', on_delete=models.SET_NULL, null=True, blank=True)
    semester = models.ForeignKey('core.Semester', on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=[('Planned', 'Planned'), ('Ongoing', 'Ongoing'), ('Completed', 'Completed')])

    def __str__(self):
        return f"{self.teacher.full_name} - {self.subject} - {self.date}"

class QRCodeSession(models.Model):
    schedule = models.OneToOneField(Schedule, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    expiration_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=[('active', 'Active'), ('expired', 'Expired')], default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    activated_by = models.ForeignKey(TeacherProfile, on_delete=models.SET_NULL, null=True, blank=True)
    is_used = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"QR Session for {self.schedule}"

class TeacherAttendance(models.Model):
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    checkin_time = models.DateTimeField(null=True, blank=True)
    checkout_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=[
        ('present', 'Present'),
        ('late', 'Late'),
        ('absent', 'Absent'),
    ], default='absent')
    created_at = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True)
    verified_by = models.ForeignKey('users.StaffProfile', on_delete=models.SET_NULL, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.teacher.full_name} - {self.schedule.date} - {self.status}"
