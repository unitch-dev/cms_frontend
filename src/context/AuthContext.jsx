import { createContext, useContext, useState, useCallback } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(username, password);
      const { token, user: loggedInUser } = res.data;
      localStorage.setItem("cms_token", token);
      localStorage.setItem("cms_user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
