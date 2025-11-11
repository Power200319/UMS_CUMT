from rest_framework import viewsets
from .models import StudentProfile, StudentAttendance
from .serializers import StudentProfileSerializer, StudentAttendanceSerializer

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer

class StudentAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StudentAttendance.objects.all()
    serializer_class = StudentAttendanceSerializer
