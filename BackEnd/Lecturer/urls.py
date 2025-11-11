from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'teacher-applications', views.TeacherApplicationViewSet)
router.register(r'teacher-profiles', views.TeacherProfileViewSet)
router.register(r'contracts', views.ContractViewSet)
router.register(r'schedules', views.ScheduleViewSet)
router.register(r'qr-code-sessions', views.QRCodeSessionViewSet)
router.register(r'teacher-attendances', views.TeacherAttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]