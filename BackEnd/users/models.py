from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# ----------------------------
# 1. Custom User Manager
# ----------------------------
class UserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra_fields)


# ----------------------------
# 2. User Model
# ----------------------------
class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')], blank=True)
    profile_image = models.ImageField(upload_to='user_profiles/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


# ----------------------------
# 3. Role Model
# ----------------------------
class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    full_name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    hire_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    photo = models.ImageField(upload_to='staff_photos/', null=True, blank=True)
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    national_id = models.CharField(max_length=20, unique=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.position}"

    class Meta:
        verbose_name = "Staff Profile"
        verbose_name_plural = "Staff Profiles"


class StaffActivity(models.Model):
    ACTIVITY_TYPES = [
        ('application_review', 'Application Review'),
        ('student_creation', 'Student Creation'),
        ('schedule_creation', 'Schedule Creation'),
        ('attendance_monitor', 'Attendance Monitor'),
        ('report_generation', 'Report Generation'),
    ]

    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=[('success', 'Success'), ('failed', 'Failed')], default='success')
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.TextField(blank=True)
    verified_by = models.ForeignKey(StaffProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_activities')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.staff.full_name} - {self.activity_type} ({self.status})"

    class Meta:
        verbose_name = "Staff Activity"
        verbose_name_plural = "Staff Activities"


# ----------------------------
# 4. Role Model
# ----------------------------
class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.ManyToManyField('Permission', related_name='roles', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Role"
        verbose_name_plural = "Roles"


# ----------------------------
# 4. Permission Model
# ----------------------------
class Permission(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Permission"
        verbose_name_plural = "Permissions"


# ----------------------------
# 5. UserRole (many-to-many between User & Role)
# ----------------------------
class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_users')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'role')

    def __str__(self):
        return f"{self.user.username} → {self.role.name}"


