from rest_framework import viewsets
from .models import TeacherApplication, TeacherProfile, Contract, Schedule, QRCodeSession, TeacherAttendance
from .serializers import (
    TeacherApplicationSerializer, TeacherProfileSerializer, ContractSerializer,
    ScheduleSerializer, QRCodeSessionSerializer, TeacherAttendanceSerializer
)

class TeacherApplicationViewSet(viewsets.ModelViewSet):
    queryset = TeacherApplication.objects.all()
    serializer_class = TeacherApplicationSerializer

class TeacherProfileViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherProfileSerializer

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class QRCodeSessionViewSet(viewsets.ModelViewSet):
    queryset = QRCodeSession.objects.all()
    serializer_class = QRCodeSessionSerializer

class TeacherAttendanceViewSet(viewsets.ModelViewSet):
    queryset = TeacherAttendance.objects.all()
    serializer_class = TeacherAttendanceSerializer
