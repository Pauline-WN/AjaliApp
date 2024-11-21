import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  username: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await axios.get('http://localhost:5000/check_session');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:5000/login', {
      email,
      password,
    }, { withCredentials: true });
    setUser(response.data.user);
  };

  const register = async (username: string, email: string, password: string) => {
    await axios.post('http://localhost:5000/users', {
      username,
      email,
      password,
    });
  };

  const logout = async () => {
    await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}