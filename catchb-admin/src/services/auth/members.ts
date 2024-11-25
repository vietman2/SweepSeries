import axios from "axios";

export const getUsers = async () => {
  try {
    const response = await axios.get(`/api/users/`);

    return response.data;
  } catch {
    return null;
  }
};
