from django.contrib import admin
from .models import Department, Major, Class, Subject, SystemSettings, AuditLog


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'head_of_department', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'code')
    ordering = ('name',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description')
        }),
        ('Management', {
            'fields': ('head_of_department', 'is_active')
        }),
        ('Location & Contact', {
            'fields': ('building_location', 'contact_email')
        }),
    )


@admin.register(Major)
class MajorAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'department', 'degree_type', 'is_active', 'created_at')
    list_filter = ('department', 'degree_type', 'is_active', 'created_at')
    search_fields = ('name', 'code')
    ordering = ('name',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'department', 'description')
        }),
        ('Academic Details', {
            'fields': ('degree_type', 'duration_years', 'department_head')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'major', 'academic_year', 'semester', 'current_students', 'max_students', 'is_active')
    list_filter = ('major', 'academic_year', 'semester', 'is_active')
    search_fields = ('name', 'major__name')
    ordering = ('-academic_year', 'name')

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'major', 'academic_year', 'semester')
        }),
        ('Capacity & Management', {
            'fields': ('max_students', 'current_students', 'class_teacher', 'room_number', 'shift')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'department', 'credits', 'year_level', 'is_active')
    list_filter = ('department', 'year_level', 'semester_offered', 'is_active')
    search_fields = ('name', 'code')
    ordering = ('name',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'department', 'description')
        }),
        ('Academic Details', {
            'fields': ('credits', 'semester_offered', 'year_level', 'majors')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'category', 'data_type', 'is_public', 'updated_at')
    list_filter = ('category', 'data_type', 'is_public')
    search_fields = ('key', 'description')
    ordering = ('category', 'key')

    fieldsets = (
        ('Setting Information', {
            'fields': ('key', 'value', 'description', 'category', 'data_type')
        }),
        ('Permissions', {
            'fields': ('is_public',)
        }),
    )

    readonly_fields = ('updated_at', 'updated_by')


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'model_name', 'timestamp', 'ip_address')
    list_filter = ('action', 'model_name', 'timestamp')
    search_fields = ('user__username', 'model_name', 'object_id', 'details')
    ordering = ('-timestamp',)
    readonly_fields = ('user', 'action', 'model_name', 'object_id', 'details',
                      'ip_address', 'user_agent', 'timestamp', 'content_type',
                      'object_pk', 'updated_at')

    fieldsets = (
        ('Audit Information', {
            'fields': ('user', 'action', 'model_name', 'object_id', 'timestamp')
        }),
        ('Details', {
            'fields': ('details', 'content_type', 'object_pk')
        }),
        ('Technical Information', {
            'fields': ('ip_address', 'user_agent')
        }),
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
