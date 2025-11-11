from rest_framework import serializers
from .models import User, Role, Permission, UserRole, StaffProfile
from lecturer.models import TeacherProfile
from student.models import StudentProfile

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'code', 'description']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'created_at', 'permissions']

class UserRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = UserRole
        fields = ['id', 'role', 'assigned_at']

class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = ['id', 'full_name', 'employee_id', 'department', 'position',
                 'gender', 'national_id', 'address', 'phone', 'email', 'photo',
                 'hire_date', 'salary', 'supervisor', 'is_active', 'created_at', 'updated_at']

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['id', 'full_name', 'gender', 'date_of_birth', 'nationality',
                 'place_of_birth', 'degree', 'major_name', 'institution', 'phone',
                 'email', 'experience', 'photo', 'cv', 'certificate', 'created_at',
                 'department', 'major', 'is_active', 'hire_date', 'updated_at',
                 'address', 'emergency_contact', 'bio']

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['id', 'full_name', 'gender', 'date_of_birth', 'national_id',
                 'phone', 'email', 'address', 'department_name', 'major_name',
                 'class_name', 'study_year', 'semester', 'photo', 'transcript',
                 'created_at', 'department', 'major', 'class_obj', 'academic_year',
                 'gpa', 'status', 'parent_name', 'parent_phone', 'enrollment_date',
                 'updated_at', 'remarks']

class UserSerializer(serializers.ModelSerializer):
    user_roles = UserRoleSerializer(many=True, read_only=True)
    staff_profile = StaffProfileSerializer(read_only=True)
    teacher_profile = TeacherProfileSerializer(read_only=True)
    student_profile = StudentProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address', 'gender',
                 'profile_image', 'is_verified', 'date_of_birth', 'created_at',
                 'updated_at', 'user_roles', 'staff_profile', 'teacher_profile', 'student_profile']
        read_only_fields = ['id', 'created_at', 'updated_at']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class UserDetailSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    role_display = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address', 'gender',
                 'profile_image', 'profile_image_url', 'is_verified', 'date_of_birth', 'created_at',
                 'updated_at', 'roles', 'permissions', 'display_name', 'role_display', 'department']

    def get_roles(self, obj):
        user_roles = UserRole.objects.filter(user=obj)
        return RoleSerializer([ur.role for ur in user_roles], many=True).data

    def get_permissions(self, obj):
        user_roles = UserRole.objects.filter(user=obj)
        permissions = set()
        for user_role in user_roles:
            role_permissions = user_role.role.permissions.all()
            for perm in role_permissions:
                permissions.add(perm)
        return PermissionSerializer(list(permissions), many=True).data

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
        return None

    def get_display_name(self, obj):
        # Try to get from profiles in order: staff, teacher, student, then fallback to username
        if hasattr(obj, 'staff_profile') and obj.staff_profile and obj.staff_profile.full_name:
            return obj.staff_profile.full_name
        if hasattr(obj, 'teacher_profile') and obj.teacher_profile and obj.teacher_profile.full_name:
            return obj.teacher_profile.full_name
        if hasattr(obj, 'student_profile') and obj.student_profile and obj.student_profile.full_name:
            return obj.student_profile.full_name
        return obj.username

    def get_role_display(self, obj):
        user_roles = UserRole.objects.filter(user=obj)
        if user_roles.exists():
            return user_roles.first().role.name
        return 'User'

    def get_department(self, obj):
        # Try to get department from profiles in order: staff, teacher, student
        if hasattr(obj, 'staff_profile') and obj.staff_profile and obj.staff_profile.department:
            return obj.staff_profile.department
        if hasattr(obj, 'teacher_profile') and obj.teacher_profile and obj.teacher_profile.department:
            return obj.teacher_profile.department
        if hasattr(obj, 'student_profile') and obj.student_profile and obj.student_profile.department:
            return obj.student_profile.department
        return None