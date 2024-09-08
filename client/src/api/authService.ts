import { useApi } from '../hooks/useApi';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}

export interface User {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: number;
  email_verified: number;
  address: string;
  phone_number: string;
  createdAt: string;
  updatedAt: string;
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const useAuth = () => {
  const { request, loading, error } = useApi<LoginResponse>();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await request('post', '/auth/login', credentials);
      if (response?.user && response.tokens) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('accessToken', response.tokens.access.token);
        localStorage.setItem('refreshToken', response.tokens.refresh.token);
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await request('post', '/auth/logout', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return { login, logout, getCurrentUser, loading, error };
};