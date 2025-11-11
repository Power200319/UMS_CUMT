from rest_framework import viewsets
from .models import StaffProfile, StaffActivity
from .serializers import StaffProfileSerializer, StaffActivitySerializer

class StaffProfileViewSet(viewsets.ModelViewSet):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer

class StaffActivityViewSet(viewsets.ModelViewSet):
    queryset = StaffActivity.objects.all()
    serializer_class = StaffActivitySerializer