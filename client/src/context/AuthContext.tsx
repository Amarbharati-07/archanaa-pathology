import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: number;
}

interface Admin {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  userToken: string | null;
  adminToken: string | null;
  userLogin: (email: string, password: string) => Promise<void>;
  userRegister: (data: any) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const savedUserToken = localStorage.getItem("userToken");
    const savedAdminToken = localStorage.getItem("adminToken");
    
    if (savedUserToken) setUserToken(savedUserToken);
    if (savedAdminToken) setAdminToken(savedAdminToken);
  }, []);

  const userRegister = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const result = await res.json();
      setUserToken(result.token);
      setUser(result.user);
      localStorage.setItem("userToken", result.token);
    } finally {
      setLoading(false);
    }
  };

  const userLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const result = await res.json();
      setUserToken(result.token);
      setUser(result.user);
      localStorage.setItem("userToken", result.token);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const result = await res.json();
      setAdminToken(result.token);
      setAdmin(result.admin);
      localStorage.setItem("adminToken", result.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setUserToken(null);
    setAdminToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        userToken,
        adminToken,
        userLogin,
        userRegister,
        adminLogin,
        logout,
        isAuthenticated: !!user && !!userToken,
        isAdminAuthenticated: !!admin && !!adminToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
