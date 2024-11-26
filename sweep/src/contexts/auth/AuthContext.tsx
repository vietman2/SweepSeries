import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { refresh } from "@services/auth";

interface AuthContextType {
  login: (mode: "pro" | "normal", profileIndex: number) => void;
  logout: () => void;
  mode: "pro" | "normal" | "guest";
  selectedProfileId: number | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"pro" | "normal" | "guest">("guest");
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.status === 403 &&
          error.response.data.code === "token_not_valid" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await refresh();
            if (response) {
              const newAccessToken = response;

              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError: any) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Remove the interceptor when AuthProvider unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = (mode: "pro" | "normal", profileIndex: number) => {
    setMode(mode);
    setSelectedProfileId(profileIndex);
  };

  const logout = () => {
    setMode("guest");
    setSelectedProfileId(null);
  };

  const isAuthenticated = mode !== "guest";

  const value = useMemo(
    () => ({ mode, login, logout, isAuthenticated, selectedProfileId }),
    [mode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
