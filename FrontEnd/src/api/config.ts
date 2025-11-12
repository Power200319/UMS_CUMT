// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

// JWT Token Management
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
  roles?: any[];
  permissions?: any[];
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: AuthUser;
}

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  USER: 'user_data',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/users/login/`,
    LOGOUT: `${API_BASE_URL}/users/logout/`,
    TOKEN_REFRESH: `${API_BASE_URL}/users/token/refresh/`,
    TOKEN_BLACKLIST: `${API_BASE_URL}/users/token/blacklist/`,
    USERS: `${API_BASE_URL}/users/users/`,
    ROLES: `${API_BASE_URL}/users/roles/`,
    PERMISSIONS: `${API_BASE_URL}/users/permissions/`,
    USER_ROLES: `${API_BASE_URL}/users/user-roles/`,
    CHECK_PERMISSION: `${API_BASE_URL}/users/check-permission/`,
    USER_PERMISSIONS: `${API_BASE_URL}/users/user-permissions/`,
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard/`,
    DASHBOARD_ACTIVITY: `${API_BASE_URL}/admin/dashboard/activity/`,
    DASHBOARD_REGISTRATIONS: `${API_BASE_URL}/admin/dashboard/registrations/`,
    DASHBOARD_MAJORS: `${API_BASE_URL}/admin/dashboard/majors/`,
    DASHBOARD_ATTENDANCE: `${API_BASE_URL}/admin/dashboard/attendance/`,
    USERS: `${API_BASE_URL}/users/users/`,
    DEPARTMENTS: `${API_BASE_URL}/admin/departments/`,
    MAJORS: `${API_BASE_URL}/admin/majors/`,
    CLASSES: `${API_BASE_URL}/admin/classes/`,
    COURSES: `${API_BASE_URL}/admin/courses/`,
    SUBJECTS: `${API_BASE_URL}/admin/subjects/`,
    SYSTEM_SETTINGS: `${API_BASE_URL}/admin/system-settings/`,
    AUDIT_LOGS: `${API_BASE_URL}/admin/audit-logs/`,
  },

  // Lecturer endpoints
  LECTURER: {
    TEACHER_APPLICATIONS: `${API_BASE_URL}/lecturer/teacher-applications/`,
    TEACHER_PROFILES: `${API_BASE_URL}/lecturer/teacher-profiles/`,
    CONTRACTS: `${API_BASE_URL}/lecturer/contracts/`,
    SCHEDULES: `${API_BASE_URL}/lecturer/schedules/`,
    QR_CODE_SESSIONS: `${API_BASE_URL}/lecturer/qr-code-sessions/`,
    TEACHER_ATTENDANCES: `${API_BASE_URL}/lecturer/teacher-attendances/`,
  },

  // Staff endpoints
  STAFF: {
    STAFF_PROFILES: `${API_BASE_URL}/staff/staff-profiles/`,
    STAFF_ACTIVITIES: `${API_BASE_URL}/staff/staff-activities/`,
  },

  // Student endpoints
  STUDENT: {
    STUDENT_PROFILES: `${API_BASE_URL}/student/student-profiles/`,
    STUDENT_ATTENDANCES: `${API_BASE_URL}/student/student-attendances/`,
  },
};

// Token management functions
export const getStoredTokens = (): AuthTokens | null => {
  const access = localStorage.getItem(TOKEN_KEYS.ACCESS);
  const refresh = localStorage.getItem(TOKEN_KEYS.REFRESH);
  return access && refresh ? { access, refresh } : null;
};

export const setStoredTokens = (tokens: AuthTokens) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.access);
  localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refresh);
};

export const clearStoredTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  localStorage.removeItem(TOKEN_KEYS.USER);
};

export const getStoredUser = (): AuthUser | null => {
  const userData = localStorage.getItem(TOKEN_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const setStoredUser = (user: AuthUser) => {
  localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

// API Helper functions with JWT support
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const tokens = getStoredTokens();
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if we have a token
  if (tokens?.access) {
    // Check if access token is expired
    if (isTokenExpired(tokens.access)) {
      // Try to refresh the token
      try {
        const newTokens = await refreshAccessToken();
        if (newTokens) {
          setStoredTokens(newTokens);
          tokens.access = newTokens.access;
        } else {
          // Refresh failed, clear tokens and redirect to login
          clearStoredTokens();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      } catch (error) {
        clearStoredTokens();
        window.location.href = '/login';
        throw error;
      }
    }

    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${tokens.access}`,
    };
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized (token might be invalid)
    if (response.status === 401) {
      clearStoredTokens();
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Token refresh function
export const refreshAccessToken = async (): Promise<AuthTokens | null> => {
  const tokens = getStoredTokens();
  if (!tokens?.refresh) {
    return null;
  }

  try {
    const response = await fetch(API_ENDPOINTS.AUTH.TOKEN_REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: tokens.refresh,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        access: data.access,
        refresh: data.refresh || tokens.refresh, // Use new refresh if provided
      };
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  return null;
};

// Authentication functions
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data: AuthResponse = await response.json();

  // Store tokens and user data
  setStoredTokens({ access: data.access, refresh: data.refresh });
  setStoredUser(data.user);

  return data;
};

export const logout = async (): Promise<void> => {
  const tokens = getStoredTokens();
  if (tokens?.refresh) {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  }

  // Clear stored data regardless of API call success
  clearStoredTokens();
};

export const get = (url: string) => apiRequest(url);
export const post = (url: string, data: any) => apiRequest(url, {
  method: 'POST',
  body: JSON.stringify(data),
});
export const put = (url: string, data: any) => apiRequest(url, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const del = (url: string) => apiRequest(url, {
  method: 'DELETE',
});