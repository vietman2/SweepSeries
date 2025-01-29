import axios from "axios";

export async function checkUsernameEmail(username: string, email: string) {
  try {
    const response = await axios.get("/v1/check-username-email/", {
      params: {
        username,
        email,
      },
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return {
        status: err.response?.status,
        data: err.response?.data,
      };
    }

    return {
      status: 400,
      data: "오류가 발생했습니다.",
    };
  }
}

export async function checkPassword(password: string, password2: string) {
  try {
    const response = await axios.post("/v1/check-password/", {
      password,
      password2,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return {
        status: err.response?.status,
        data: err.response?.data,
      };
    }

    return {
      status: 400,
      data: "오류가 발생했습니다.",
    };
  }
}

export async function requestCode(phone: string) {
  try {
    await axios.post("/v1/verification-code/", {
      phone,
    });

    return true;
  } catch {
    return null;
  }
}

export async function verifyCode(phone: string, code: string) {
  try {
    await axios.post("/v1/verify-phone/", {
      phone,
      code,
    });

    return {
      status: 200,
      data: "인증되었습니다.",
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return {
        status: 400,
        data: err.response?.data,
      };
    }

    return {
      status: 400,
      data: "오류가 발생했습니다.",
    };
  }
}

export async function register(
  mode: string,
  data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    name: string;
    phone: string;
  },
  profile: {
    gender: string;
    birthdate: string;
    nickname: string;
    profileImage: string;
  },
  notificationsAgreed: boolean
) {
  try {
    await axios.post("/v1/register/", {
      mode,
      user: data,
      profile,
      notifications: notificationsAgreed,
    });

    return true;
  } catch {
    return null;
  }
}
