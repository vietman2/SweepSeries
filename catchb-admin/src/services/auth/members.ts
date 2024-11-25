import axios from "axios";

export const getUsers = async () => {
  try {
    const response = await axios.get(`/v1/users/`);

    return response.data;
  } catch {
    return null;
  }
};

export const getUserDetails = async (userId: string | undefined) => {
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.get(`/v1/users/${userId}/`);

    return response.data;
  } catch {
    return null;
  }
};

export const getPeople = async () => {
  try {
    const response = await axios.get(`/v1/people/`);

    return response.data;
  } catch {
    return null;
  }
};
