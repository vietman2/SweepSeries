import axios from "axios";

export const getUsers = async () => {
  try {
    const response = await axios.get(`/api/users/`);

    return response.data;
  } catch {
    return null;
  }
};

export const getPeople = async () => {
  try {
    const response = await axios.get(`/api/people/`);

    return response.data;
  } catch {
    return null;
  }
};
