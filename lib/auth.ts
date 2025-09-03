// Authentication service for Bizatlas app
// Handles signup, signin, and token management

// Using Next.js API routes instead of direct backend calls

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
  error?: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token and user from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          this.clearAuth();
        }
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Signup method
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.data) {
        this.setAuth(result.data.token, result.data.user);
      }

      return result;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'Network error during signup. Please try again.',
      };
    }
  }

  // Login method
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.data) {
        this.setAuth(result.data.token, result.data.user);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error during login. Please try again.',
      };
    }
  }

  // Set authentication data
  private setAuth(token: string, user: User): void {
    this.token = token;
    this.user = user;

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  // Clear authentication data
  clearAuth(): void {
    this.token = null;
    this.user = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  // Logout method
  logout(): void {
    this.clearAuth();
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.token && this.user);
  }

  // Get authorization header for API calls
  getAuthHeader(): { authorization: string } | {} {
    if (this.token) {
      return { authorization: `Bearer ${this.token}` };
    }
    return {};
  }

  // Check if token is expired (basic check - decode JWT)
  isTokenExpired(): boolean {
    if (!this.token) return true;

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Auto logout if token is expired
  checkTokenValidity(): boolean {
    if (this.isTokenExpired()) {
      this.clearAuth();
      return false;
    }
    return true;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export types and service
export default authService;
