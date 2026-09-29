import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

// Auto logout after this many minutes of no interaction (mirrors backend JWT expiry)
const INACTIVITY_LIMIT_MINUTES = 30;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ims_user');
    return stored ? JSON.parse(stored) : null;
  });
  const timerRef = useRef(null);

  const logout = useCallback(async (reason) => {
    try {
      await client.post('/auth/logout');
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_user');
    setUser(null);
    if (reason === 'inactivity') {
      window.location.href = '/login?reason=timeout';
    } else {
      window.location.href = '/login';
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!localStorage.getItem('ims_token')) return;
    timerRef.current = setTimeout(() => logout('inactivity'), INACTIVITY_LIMIT_MINUTES * 60 * 1000);
  }, [logout]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => events.forEach((e) => window.removeEventListener(e, resetTimer));
  }, [resetTimer]);

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('ims_token', data.token);
    const userInfo = { fullName: data.fullName, email: data.email, role: data.role };
    localStorage.setItem('ims_user', JSON.stringify(userInfo));
    setUser(userInfo);
    resetTimer();
    return userInfo;
  };

  const register = async (payload) => {
    const { data } = await client.post('/auth/register', payload);
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await client.post('/auth/forgot-password', { email });
    return data;
  };

  const resetPassword = async (token, newPassword) => {
    const { data } = await client.post('/auth/reset-password', { token, newPassword });
    return data;
  };

  const verifyEmail = async (token) => {
    const { data } = await client.get('/auth/verify-email', { params: { token } });
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, forgotPassword, resetPassword, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
