import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

interface AuthContextType {
  login: () => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  /*
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
                setToken(newAccessToken);

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

  const setToken = (accessToken: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  };

  const login = (user: UserProfileType) => {
    setUser(user);
    localStorage.setItem("user_id", user.uuid);
  };

  const logout = () => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("user_id");
  };
*/
  const login = () => {
    setToken("token");
  };
  const logout = () => {
    console.log("logout");
  };
  const value = useMemo(() => ({ login, logout, token }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
