import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionCode: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.some(permission => permission.code === permissionCode);
  };

  const hasRole = (roleName: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.some(role => role.name.toLowerCase() === roleName.toLowerCase());
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!user?.roles) return false;
    return user.roles.some(role => roleNames.includes(role.name.toLowerCase()));
  };

  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissionCodes.every(code =>
      user.permissions.some(permission => permission.code === code)
    );
  };

  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissionCodes.some(code =>
      user.permissions.some(permission => permission.code === code)
    );
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
    hasAnyPermission,
    permissions: user?.permissions || [],
    roles: user?.roles || [],
  };
};