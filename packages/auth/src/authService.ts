/**
 * Authentication Service
 * Shared across host and remote-app
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

class AuthService {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null
  };

  login(email: string, password: string): Promise<User> {
    // Simulated login
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: '1',
          name: 'Demo User',
          email,
          role: 'user'
        };
        this.state.user = user;
        this.state.isAuthenticated = true;
        this.state.token = 'mock-token-' + Date.now();
        resolve(user);
      }, 500);
    });
  }

  logout(): void {
    this.state.user = null;
    this.state.isAuthenticated = false;
    this.state.token = null;
  }

  getCurrentUser(): User | null {
    return this.state.user;
  }

  isLoggedIn(): boolean {
    return this.state.isAuthenticated;
  }

  getToken(): string | null {
    return this.state.token;
  }
}

export const authService = new AuthService();
export default authService;
