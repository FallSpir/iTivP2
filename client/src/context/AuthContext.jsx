import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(() => {
    try { return localStorage.getItem('mh_auth') === 'true'; }
    catch { return false; }
  });
  const [username, setUsername] = useState(() => {
    try { return localStorage.getItem('mh_user') || ''; }
    catch { return ''; }
  });

  const login = useCallback((name) => {
    try {
      localStorage.setItem('mh_auth', 'true');
      localStorage.setItem('mh_user', String(name).slice(0, 50));
    } catch {}
    setIsAuth(true);
    setUsername(String(name).slice(0, 50));
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('mh_auth');
      localStorage.removeItem('mh_user');
    } catch {}
    setIsAuth(false);
    setUsername('');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
