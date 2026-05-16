import { createContext, useContext, useEffect, useState } from "react";

import {
  getAuthenticatedUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../api/auth";

import api from "../api/client";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "etf_rocket_auth_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    async function restoreUser() {
      if (!token) {
        setLoading(false);

        return;
      }

      try {
        const response = await getAuthenticatedUser();

        setUser(response.data);
      } catch (error) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreUser();
  }, [token]);

  async function login(payload) {
    const response = await loginRequest(payload);

    if (!response.token || !response.user) {
      throw {
        response: {
          data: {
            message: response.message || "Unable to login. Please try again.",
          },
        },
      };
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);

    setToken(response.token);
    setUser(response.user);

    return response;
  }

  async function register(payload) {
    const response = await registerRequest(payload);

    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);

    setToken(response.token);
    setUser(response.user);

    return response;
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);

      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
