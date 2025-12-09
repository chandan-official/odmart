/* eslint-disable react-hooks/immutability */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded: { exp?: number } = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        setIsLoggedIn(true);
        const timeout = (decoded.exp - now) * 1000;
        const timer = setTimeout(() => {
          logout();
        }, timeout);
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    router.push("/register");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
