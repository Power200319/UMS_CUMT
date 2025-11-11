from rest_framework import serializers
from .models import StaffProfile, StaffActivity

class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = '__all__'

class StaffActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffActivity
        fields = '__all__'