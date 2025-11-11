from rest_framework import serializers
from .models import Department, Major, Class, Subject, SystemSettings, AuditLog


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


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'