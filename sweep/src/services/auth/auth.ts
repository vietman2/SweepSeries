import axios from "axios";

import { getSecure, removeSecure, saveSecure } from "@services/storage";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post("/v1/login/", {
      username,
      password,
    });
    
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
    await saveSecure("refreshToken", response.data.refresh);

    return response.data;
  } catch {
    return null;
  }
};

export const logout = async () => {
  try {
    await axios.post("/v1/logout/");

    delete axios.defaults.headers.common["Authorization"];
    await removeSecure("refreshToken");

    return true;
  } catch {
    return null;
  }
};

export const refresh = async () => {
  try {
    const refreshToken = await getSecure("refreshToken");
    const response = await axios.post("/v1/tokens/refresh/", {
      refresh: refreshToken,
    });
    return response.data;
  } catch {
    return null;
  }
};
