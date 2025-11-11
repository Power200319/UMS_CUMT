from django.urls import path
from rest_framework_simplejwt.views import TokenBlacklistView
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('roles/', views.RoleListView.as_view(), name='role-list'),
    path('permissions/', views.PermissionListView.as_view(), name='permission-list'),
    path('user-roles/', views.UserRoleListView.as_view(), name='user-role-list'),
    path('check-permission/<str:permission_code>/', views.check_permission, name='check-permission'),
    path('user-permissions/', views.user_permissions, name='user-permissions'),
    path('user-roles/', views.user_roles, name='user-roles'),
]