import axios from "axios";

export async function checkUsernameEmail(username: string, email: string) {
  try {
    const response = await axios.get("/api/check-username-email/", {
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
    const response = await axios.post("/api/check-password/", {
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
