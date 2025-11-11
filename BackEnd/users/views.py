from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from .models import User, Role, Permission, UserRole
from .serializers import (
    UserSerializer, RoleSerializer, PermissionSerializer,
    UserRoleSerializer, LoginSerializer, UserDetailSerializer
)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)
            if user:
                update_last_login(None, user)
                refresh = RefreshToken.for_user(user)
                user_data = UserDetailSerializer(user).data

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': user_data
                })
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class RoleListView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]

class PermissionListView(generics.ListCreateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserRoleListView(generics.ListCreateAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_permission(request, permission_code):
    """
    Check if the current user has a specific permission
    """
    user = request.user
    user_roles = UserRole.objects.filter(user=user)
    for user_role in user_roles:
        if user_role.role.permissions.filter(code=permission_code).exists():
            return Response({'has_permission': True})
    return Response({'has_permission': False}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_permissions(request):
    """
    Get all permissions for the current user
    """
    user = request.user
    user_roles = UserRole.objects.filter(user=user)
    permissions = set()
    for user_role in user_roles:
        role_permissions = user_role.role.permissions.all()
        for perm in role_permissions:
            permissions.add(perm)

    serializer = PermissionSerializer(list(permissions), many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_roles(request):
    """
    Get all roles for the current user
    """
    user = request.user
    user_roles = UserRole.objects.filter(user=user)
    serializer = UserRoleSerializer(user_roles, many=True)
    return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out'})
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view that returns both access and refresh tokens
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Get the new refresh token from the response
            new_refresh_token = response.data.get('refresh')
            if new_refresh_token:
                # Decode to get access token
                refresh = RefreshToken(new_refresh_token)
                response.data['access'] = str(refresh.access_token)
        return response
