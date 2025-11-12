from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, MajorViewSet, ClassViewSet,
    CourseViewSet, SubjectViewSet, SystemSettingsViewSet, AuditLogViewSet, DashboardViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'majors', MajorViewSet)
router.register(r'classes', ClassViewSet)
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'subjects', SubjectViewSet)
router.register(r'system-settings', SystemSettingsViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]