import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ─── Mock user database ───────────────────────────────────────────────────────
const USERS = [
  // Patients
  { id: 'P-001', password: 'patient123', role: 'patient', name: 'John Doe',       avatar: 'JD', badge: 'Patient ID' },
  { id: 'P-002', password: 'patient456', role: 'patient', name: 'Priya Sharma',   avatar: 'PS', badge: 'Patient ID' },
  { id: 'P-003', password: 'pass123',    role: 'patient', name: 'Rohan Mehta',    avatar: 'RM', badge: 'Patient ID' },
  // Doctors
  { id: 'D-001', password: 'doctor123',  role: 'doctor',  name: 'Dr. Ramesh Sharma', avatar: 'RS', badge: 'Doctor ID' },
  { id: 'D-002', password: 'doctor456',  role: 'doctor',  name: 'Dr. Anita Rao',     avatar: 'AR', badge: 'Doctor ID' },
  // Admins
  { id: 'A-001', password: 'admin123',   role: 'admin',   name: 'Health Admin',      avatar: 'HA', badge: 'Admin ID' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medisight_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (userId, password, selectedRole) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, selectedRole }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        const sessionUser = data.user;
        setUser(sessionUser);
        localStorage.setItem('medisight_user', JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      // BACKUP FALLBACK: If Node.js backend is not running yet during hackathon, use the mock database but with case-insensitivity fix
      console.warn("Backend not running, falling back to local database instance.");
      
      const idSearch = userId.trim().toUpperCase();
      const found = USERS.find(
        u => (u.id === idSearch || u.id === userId.trim()) &&
             u.password === password &&
             u.role === selectedRole
      );
      if (found) {
        const sessionUser = { ...found };
        delete sessionUser.password;
        setUser(sessionUser);
        localStorage.setItem('medisight_user', JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
      }
      return { success: false, error: 'Invalid credentials. Please check your ID, password, and selected role.' };
    }
  };

  const register = async (userId, password, name, selectedRole) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, name, selectedRole }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        const sessionUser = data.user;
        setUser(sessionUser);
        localStorage.setItem('medisight_user', JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn("Backend not running, mock database register not fully supported offline");
      return { success: false, error: 'Registration failed. Backend is offline.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medisight_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
