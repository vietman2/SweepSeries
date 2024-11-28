import axios from "axios";

export const getTags = async () => {
  try {
    const response = await axios.get(`/v1/tags/`);

    return response.data;
  } catch {
    return null;
  }
};
