from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'staff-profiles', views.StaffProfileViewSet)
router.register(r'staff-activities', views.StaffActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]