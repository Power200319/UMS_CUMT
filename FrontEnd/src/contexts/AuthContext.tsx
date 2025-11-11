import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getStoredTokens, getStoredUser, setStoredUser, clearStoredTokens } from '../api/config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'lecturer' | 'student';
  avatar?: string;
  roles?: Array<{id: number, name: string, description: string}>;
  permissions?: Array<{id: number, name: string, code: string, description: string}>;
  display_name?: string;
  role_display?: string;
  department?: string;
  username?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth tokens and user data
    const storedUser = getStoredUser();
    const tokens = getStoredTokens();

    if (storedUser && tokens) {
      // Convert AuthUser to User format
      const userData: User = {
        id: storedUser.id.toString(),
        name: storedUser.username || '',
        email: storedUser.email,
        role: storedUser.roles?.[0]?.name?.toLowerCase() || 'staff',
        avatar: (storedUser as any).profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedUser.username}`,
        roles: (storedUser as any).roles,
        permissions: (storedUser as any).permissions,
        display_name: (storedUser as any).display_name || storedUser.username,
        role_display: (storedUser as any).role_display || 'User',
        department: (storedUser as any).department,
        username: storedUser.username,
        is_staff: storedUser.is_staff,
        is_superuser: storedUser.is_superuser,
      };
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(username, password);

      if (response) {
        const userData: User = {
          id: response.user.id.toString(),
          name: response.user.username,
          email: response.user.email,
          role: response.user.roles?.[0]?.name?.toLowerCase() || 'staff',
          avatar: (response.user as any).profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.username}`,
          roles: (response.user as any).roles,
          permissions: (response.user as any).permissions,
          display_name: (response.user as any).display_name || response.user.username,
          role_display: (response.user as any).role_display || 'User',
          department: (response.user as any).department,
        };
        setUser(userData);
        setStoredUser(userData as any);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of API call success
      setUser(null);
      clearStoredTokens();
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
