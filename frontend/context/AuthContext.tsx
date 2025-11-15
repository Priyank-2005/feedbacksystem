"use client";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<any>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export default function AuthProvider({ children }: any) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t && t !== "undefined") setToken(t);
      if (u && u !== "undefined") {
        try {
          setUser(JSON.parse(u));
        } catch (e) {
          console.warn("AuthProvider: failed to parse stored user, clearing it.", e);
          localStorage.removeItem("user");
        }
      }
    } catch (e) {
      // localStorage might be unavailable in some environments; fail silently
      console.warn("AuthProvider: error reading localStorage", e);
    }
  }, []);

  const login = (t: string, u: any) => {
    try {
      setToken(t);
      setUser(u);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
    } catch (e) {
      console.warn("AuthProvider: failed to write to localStorage", e);
    }
  };

  const logout = () => {
    try {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.warn("AuthProvider: failed to remove localStorage keys", e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}