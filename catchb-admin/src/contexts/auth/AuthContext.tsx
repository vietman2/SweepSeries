import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

import { refresh } from "@services/auth";

interface AuthContextType {
  login: (accessToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
            if (response && response.status === 200) {
              const newAccessToken = response.data.access;
              login(newAccessToken);

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

  const login = (accessToken: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setIsAuthenticated(true);
  };

  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ login, logout, isAuthenticated }),
    [isAuthenticated]
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
