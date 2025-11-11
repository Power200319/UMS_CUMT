from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'student-profiles', views.StudentProfileViewSet)
router.register(r'student-attendances', views.StudentAttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]