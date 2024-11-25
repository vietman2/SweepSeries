import axios from "axios";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`/v1/login/`, {
      username: username,
      password: password,
    });

    return response.data;
  } catch {
    return null;
  }
};

export const logout = async () => {
  try {
    await axios.post(`/v1/logout/`, {});

    return true;
  } catch {
    return null;
  }
};

export const refresh = async () => {
  try {
    const response = await axios.post(`/v1/tokens/refresh/`, {});

    return response.data;
  } catch {
    return null;
  }
};
