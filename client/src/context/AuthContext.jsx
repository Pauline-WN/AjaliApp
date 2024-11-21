import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

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

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/login', {
      email,
      password,
    }, { withCredentials: true });
    setUser(response.data.user);
  };

  const register = async (username, email, password) => {
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}