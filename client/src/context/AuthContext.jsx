import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const USERS = {
  admin: { password: 'admin123', role: 'admin' },
  user:  { password: 'user123',  role: 'user'  },
};

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(() => {
    try { return localStorage.getItem('mh_auth') === 'true'; }
    catch { return false; }
  });
  const [username, setUsername] = useState(() => {
    try { return localStorage.getItem('mh_user') || ''; }
    catch { return ''; }
  });
  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem('mh_role');
      if (saved) return saved;
      const name = localStorage.getItem('mh_user');
      return USERS[name]?.role || '';
    } catch { return ''; }
  });

  const login = useCallback((name, password) => {
    const user = USERS[name];
    if (!user || user.password !== password) return false;
    try {
      localStorage.setItem('mh_auth', 'true');
      localStorage.setItem('mh_user', name);
      localStorage.setItem('mh_role', user.role);
    } catch {}
    setIsAuth(true);
    setUsername(name);
    setRole(user.role);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('mh_auth');
      localStorage.removeItem('mh_user');
      localStorage.removeItem('mh_role');
    } catch {}
    setIsAuth(false);
    setUsername('');
    setRole('');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
