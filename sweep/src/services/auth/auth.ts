import axios from "axios";
import { GetProfileResponse } from "@react-native-seoul/naver-login";

import { getSecure, removeSecure, saveSecure } from "@services/storage";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post("/v1/login/", {
      username,
      password,
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

export const kakaoLogin = async () => {
  try {
    const response = await axios.post("/v1/login/kakao/", {});

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;
    await saveSecure("refreshToken", response.data.refresh);

    return response.data;
  } catch {
    return null;
  }
};

export const naverLogin = async (data: GetProfileResponse) => {
  try {
    const response = await axios.post("/v1/login/naver/", {
      username: data.response.id,
      email: data.response.email,
      name: data.response.name,
      phone_number: data.response.mobile,
      birthday: data.response.birthday || "",
      birthyear: data.response.birthyear || "",
      gender: data.response.gender || "",
      nickname: data.response.nickname || "",
      profile_image: data.response.profile_image || "",
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

export const logout = async () => {
  try {
    const refreshToken = await getSecure("refreshToken");
    await axios.post("/v1/logout/", {
      refresh: refreshToken,
    });

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
