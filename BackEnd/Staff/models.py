from django.db import models
from users.models import User, StaffProfile


class StaffActivity(models.Model):
    ACTIVITY_TYPES = [
        ('application_review', 'Application Review'),
        ('student_creation', 'Student Creation'),
        ('schedule_creation', 'Schedule Creation'),
        ('attendance_monitor', 'Attendance Monitor'),
        ('report_generation', 'Report Generation'),
    ]

    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name='staff_activities')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=[('success', 'Success'), ('failed', 'Failed')], default='success')
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.TextField(blank=True)
    verified_by = models.ForeignKey(StaffProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_verified_activities')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.staff.full_name} - {self.activity_type} ({self.status})"

    class Meta:
        verbose_name = "Staff Activity"
        verbose_name_plural = "Staff Activities"
