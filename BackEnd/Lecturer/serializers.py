from rest_framework import serializers
from .models import TeacherApplication, TeacherProfile, Contract, Schedule, QRCodeSession, TeacherAttendance

class TeacherApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherApplication
        fields = '__all__'

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = '__all__'

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'

class QRCodeSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCodeSession
        fields = '__all__'

class TeacherAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAttendance
        fields = '__all__'