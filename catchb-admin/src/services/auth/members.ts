import axios from "axios";

export const getUsers = async (role?: string) => {
  try {
    const response = await axios.get(`/api/users/`, {
      params: role && {
        role,
      },
    });

    return response.data;
  } catch {
    return null;
  }
};
