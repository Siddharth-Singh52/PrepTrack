import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('preptrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('preptrack_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore current user profile from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('preptrack_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('preptrack_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          localStorage.removeItem('preptrack_token');
          localStorage.removeItem('preptrack_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('preptrack_token', data.token);
        localStorage.setItem('preptrack_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setError(null);
    try {
      const data = await authService.register({ name, email, password, confirmPassword });
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('preptrack_token', data.token);
        localStorage.setItem('preptrack_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('preptrack_token');
    localStorage.removeItem('preptrack_user');
    setUser(null);
    setToken(null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('preptrack_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
