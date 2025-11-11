from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# ----------------------------
# 1. System Settings
# ----------------------------
class SystemSettings(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default='general')
    data_type = models.CharField(max_length=50, default='string')  # string, int, bool, etc.
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_settings'
    )

    def __str__(self):
        return f"{self.key}: {self.value[:30]}"

    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"


# ----------------------------
# 2. Audit Log
# ----------------------------
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

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=50, blank=True)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.action} - {self.model_name}"

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"


# ----------------------------
# 3. Academic Year
# ----------------------------
class AcademicYear(models.Model):
    year_name = models.CharField(max_length=20, unique=True)  # e.g. 2024-2025
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return self.year_name

    class Meta:
        verbose_name = "Academic Year"
        verbose_name_plural = "Academic Years"


# ----------------------------
# 4. Semester
# ----------------------------
class Semester(models.Model):
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='semesters')
    name = models.CharField(max_length=20)  # e.g. Semester 1, Semester 2
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.name} - {self.academic_year.year_name}"

    class Meta:
        verbose_name = "Semester"
        verbose_name_plural = "Semesters"
        unique_together = ('academic_year', 'name')


# ----------------------------
# 5. Room
# ----------------------------
class Room(models.Model):
    room_number = models.CharField(max_length=20, unique=True)
    capacity = models.IntegerField(default=40)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"Room {self.room_number} ({self.capacity} seats)"

    class Meta:
        verbose_name = "Room"
        verbose_name_plural = "Rooms"
