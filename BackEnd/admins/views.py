from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import permission_required
from django.utils.decorators import method_decorator
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from .models import Department, Major, Class, Subject, SystemSettings, AuditLog
from .serializers import (
    DepartmentSerializer, MajorSerializer, ClassSerializer,
    SubjectSerializer, SystemSettingsSerializer, AuditLogSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(permission_required('Admin.view_department', raise_exception=True))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.add_department', raise_exception=True))
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.change_department', raise_exception=True))
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.delete_department', raise_exception=True))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class MajorViewSet(viewsets.ModelViewSet):
    queryset = Major.objects.all()
    serializer_class = MajorSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(permission_required('Admin.view_major', raise_exception=True))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.add_major', raise_exception=True))
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.change_major', raise_exception=True))
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.delete_major', raise_exception=True))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(permission_required('Admin.view_class', raise_exception=True))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.add_class', raise_exception=True))
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.change_class', raise_exception=True))
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.delete_class', raise_exception=True))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(permission_required('Admin.view_subject', raise_exception=True))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.add_subject', raise_exception=True))
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.change_subject', raise_exception=True))
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.delete_subject', raise_exception=True))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class SystemSettingsViewSet(viewsets.ModelViewSet):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(permission_required('Admin.view_systemsettings', raise_exception=True))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.add_systemsettings', raise_exception=True))
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.change_systemsettings', raise_exception=True))
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @method_decorator(permission_required('Admin.delete_systemsettings', raise_exception=True))
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(permission_required('Admin.view_auditlog', raise_exception=True))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_logs = self.get_queryset()[:50]
        serializer = self.get_serializer(recent_logs, many=True)
        return Response(serializer.data)


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get dashboard summary statistics"""
        from users.models import User
        from lecturer.models import TeacherProfile
        from student.models import StudentProfile

        total_students = StudentProfile.objects.filter(is_active=True).count()
        total_teachers = TeacherProfile.objects.filter(is_active=True).count()
        active_courses = Subject.objects.filter(is_active=True).count()
        active_classes = Class.objects.filter(is_active=True).count()

        data = {
            'totalStudents': total_students,
            'totalTeachers': total_teachers,
            'activeCourses': active_courses,
            'activeClasses': active_classes,
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def activity(self, request):
        """Get recent activity logs"""
        recent_logs = AuditLog.objects.select_related('user').order_by('-timestamp')[:20]

        activities = []
        for log in recent_logs:
            activities.append({
                'id': log.id,
                'description': f"{log.user.username} {log.action}d {log.model_name}",
                'timestamp': log.timestamp.isoformat(),
                'user': log.user.username,
            })

        return Response(activities)

    @action(detail=False, methods=['get'])
    def registrations(self, request):
        """Get student registration data for the last 12 months"""
        from student.models import StudentProfile

        # Get registrations by month for the last 12 months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)

        registrations = StudentProfile.objects.filter(
            created_at__gte=start_date,
            created_at__lte=end_date
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')

        data = []
        for reg in registrations:
            data.append({
                'month': reg['month'].strftime('%b %Y'),
                'count': reg['count']
            })

        return Response(data)

    @action(detail=False, methods=['get'])
    def majors(self, request):
        """Get major distribution data"""
        from student.models import StudentProfile

        major_distribution = StudentProfile.objects.filter(
            major__isnull=False
        ).values('major__name').annotate(
            count=Count('id')
        ).order_by('-count')

        data = []
        for dist in major_distribution:
            data.append({
                'majorName': dist['major__name'],
                'count': dist['count']
            })

        return Response(data)

    @action(detail=False, methods=['get'])
    def attendance(self, request):
        """Get attendance rate by month for the last 12 months"""
        # This would need to be implemented based on your attendance model
        # For now, return mock data
        data = [
            {'month': 'Jan 2024', 'rate': 85},
            {'month': 'Feb 2024', 'rate': 88},
            {'month': 'Mar 2024', 'rate': 82},
            {'month': 'Apr 2024', 'rate': 90},
            {'month': 'May 2024', 'rate': 87},
            {'month': 'Jun 2024', 'rate': 91},
            {'month': 'Jul 2024', 'rate': 89},
            {'month': 'Aug 2024', 'rate': 86},
            {'month': 'Sep 2024', 'rate': 92},
            {'month': 'Oct 2024', 'rate': 88},
            {'month': 'Nov 2024', 'rate': 90},
            {'month': 'Dec 2024', 'rate': 85},
        ]
        return Response(data)