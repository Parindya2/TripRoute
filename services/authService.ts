import { AuthResponse, LoginCredentials, User } from '@/types';

const API_URL = 'https://dummyjson.com';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

interface RegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          expiresInMins: 30,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_URL}/users/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Network error. Please try again.');
    }
  },
  

  // Get current user (with token)
  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          expiresInMins: 30,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};