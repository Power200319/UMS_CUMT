from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Role, Permission, UserRole, StaffProfile

# Custom User Admin
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'phone', 'is_verified', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'gender', 'date_joined')
    search_fields = ('username', 'email', 'phone')
    ordering = ('-date_joined',)

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone', 'address', 'gender', 'profile_image', 'is_verified', 'date_of_birth')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'phone', 'address', 'gender', 'profile_image', 'is_verified', 'date_of_birth')
        }),
    )

# Role Admin
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    filter_horizontal = ('permissions',)  # For many-to-many field

# Permission Admin
@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'description')
    search_fields = ('name', 'code', 'description')
    ordering = ('name',)

# UserRole Admin (Inline for User)
class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 0
    autocomplete_fields = ['role']

# Add UserRole inline to User admin
CustomUserAdmin.inlines = [UserRoleInline]

# UserRole Admin (separate view)
@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'assigned_at')
    list_filter = ('role', 'assigned_at')
    search_fields = ('user__username', 'user__email', 'role__name')
    ordering = ('-assigned_at',)
    autocomplete_fields = ['user', 'role']

# Staff Profile Admin
@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'employee_id', 'department', 'position', 'is_active', 'hire_date')
    list_filter = ('department', 'position', 'is_active', 'hire_date', 'gender')
    search_fields = ('user__username', 'user__email', 'full_name', 'employee_id', 'department', 'position')
    ordering = ('-hire_date',)

    fieldsets = (
        ('User Information', {
            'fields': ('user', 'full_name', 'employee_id')
        }),
        ('Employment Details', {
            'fields': ('department', 'position', 'hire_date', 'salary', 'supervisor', 'is_active')
        }),
        ('Personal Information', {
            'fields': ('gender', 'national_id', 'address', 'phone', 'email', 'photo')
        }),
    )

    readonly_fields = ('user',)
