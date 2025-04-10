import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getSecure, removeSecure, saveSecure } from "@services/storage";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post("/v1/login/", {
      username,
      password,
    }, {
      headers: {
        "X-Sweep-Platform": "sweep/mobile",
      },
    });

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;

    await saveSecure("refreshToken", response.data.refresh);

    return response.data;
  } catch {
    return null;
  }
};

export const socialLogin = async (id: number | string) => {
  try {
    const response = await axios.post(
      "/v1/login/social/",
      {
        username: id,
      },
      {
        headers: {
          "X-Sweep-Platform": "sweep/mobile",
        },
      }
    );

    if (response.data.result === "not_registered") {
      return "REDIRECT";
    }

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;
    await saveSecure("refreshToken", response.data.refresh);

    return response.data;
  } catch {
    return null;
  }
};

export const logout = async () => {
  try {
    const refreshToken = await getSecure("refreshToken");
    await axios.post("/v1/logout/", {
      refresh: refreshToken,
    });

    delete axios.defaults.headers.common["Authorization"];
    await removeSecure("refreshToken");
    await AsyncStorage.removeItem("selectedCalendarId");
    await AsyncStorage.removeItem("front_uuid");

    return true;
  } catch {
    return null;
  }
};

export const refresh = async () => {
  try {
    const refreshToken = await getSecure("refreshToken");
    const response = await axios.post(
      "/v1/tokens/refresh/",
      {
        refresh: refreshToken,
      },
      {
        headers: {
          "X-Sweep-Platform": "sweep/mobile",
        },
      }
    );

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;
    await saveSecure("refreshToken", response.data.refresh);
    return response.data;
  } catch {
    return null;
  }
};

export const getProfile = async (token: string) => {
  try {
    const response = await axios.get("/v1/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch {
    return null;
  }
};

export const me = async (profile_id: number | null) => {
  try {
    const response = await axios.get("/v1/users/me/", {
      params: {
        full: true,
        profile_id,
      },
    });
    return response.data;
  } catch {
    return null;
  }
};
