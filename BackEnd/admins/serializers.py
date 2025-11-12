from rest_framework import serializers
from .models import Department, Major, Class, Subject, SystemSettings, AuditLog, Course


class DepartmentSerializer(serializers.ModelSerializer):
    head_of_department_name = serializers.CharField(source='head_of_department.user.username', read_only=True)

    class Meta:
        model = Department
        fields = '__all__'


class MajorSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_head_name = serializers.CharField(source='department_head.user.username', read_only=True)

    class Meta:
        model = Major
        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):
    major_name = serializers.CharField(source='major.name', read_only=True)
    class_teacher_name = serializers.CharField(source='class_teacher.user.username', read_only=True)

    class Meta:
        model = Class
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    majors_names = serializers.StringRelatedField(source='majors', many=True, read_only=True)

    class Meta:
        model = Subject
        fields = '__all__'


class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='name')
    credits = serializers.IntegerField(source='credit')
    department_id = serializers.CharField(source='major.department.id', read_only=True)
    department_code = serializers.CharField(source='major.department.code', read_only=True)
    major_name = serializers.CharField(source='major.name', read_only=True)
    major_code = serializers.CharField(source='major.code', read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'code', 'title', 'description', 'credits', 'department_id', 'major', 'major_name', 'major_code', 'department_code', 'semester', 'is_active', 'status', 'created_at', 'updated_at']

    def get_status(self, obj):
        return 'active' if obj.is_active else 'inactive'

    def get_prerequisites(self, obj):
        return []  # Placeholder

    def get_prerequisiteIds(self, obj):
        return []  # Placeholder

    def get_status(self, obj):
        return 'active' if obj.is_active else 'inactive'

    def get_prerequisites(self, obj):
        return []  # Placeholder

    def get_prerequisiteIds(self, obj):
        return []  # Placeholder


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'