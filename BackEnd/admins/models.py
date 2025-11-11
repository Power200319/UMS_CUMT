from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import User

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    head_of_department = models.ForeignKey('users.StaffProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='department_head')
    updated_at = models.DateTimeField(auto_now=True)
    building_location = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Major(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    duration_years = models.IntegerField(default=4)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    degree_type = models.CharField(max_length=50)
    updated_at = models.DateTimeField(auto_now=True)
    department_head = models.ForeignKey('lecturer.TeacherProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='major_head')

    def __str__(self):
        return f"{self.code} - {self.name}"

class Class(models.Model):
    name = models.CharField(max_length=50, unique=True)
    major = models.ForeignKey(Major, on_delete=models.CASCADE)
    academic_year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)
    max_students = models.IntegerField(default=50)
    current_students = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class_teacher = models.ForeignKey('lecturer.TeacherProfile', on_delete=models.SET_NULL, null=True, blank=True)
    room_number = models.CharField(max_length=50, default='TBA')
    shift = models.CharField(max_length=20, choices=[('morning', 'Morning'), ('afternoon', 'Afternoon'), ('evening', 'Evening')])
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.academic_year}"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    credits = models.IntegerField(default=3)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    majors = models.ManyToManyField(Major)
    semester_offered = models.CharField(max_length=50)
    year_level = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class SystemSettings(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default='general')
    is_public = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100, blank=True)
    data_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.key}: {self.value[:50]}"

class AuditLog(models.Model):
    ACTION_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_audit_logs')
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    model_name = models.CharField(max_length=50)
    object_id = models.CharField(max_length=50, blank=True)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_pk = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey('content_type', 'object_pk')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.action} - {self.model_name} - {self.timestamp}"
