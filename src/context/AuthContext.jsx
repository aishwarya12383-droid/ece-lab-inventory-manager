import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ece_lab_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    if (email === 'admin@vsb.edu' && password === 'admin123') {
      const u = { email, name: 'Lab Administrator' };
      setUser(u);
      localStorage.setItem('ece_lab_user', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ece_lab_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
