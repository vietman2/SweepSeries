import axios from "axios";

export const getTags = async (forum: string) => {
  try {
    const response = await axios.get(`/api/tags/`, {
      params: {
        forum,
      },
    });

    return response.data;
  } catch {
    return null;
  }
};
