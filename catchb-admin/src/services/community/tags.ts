import axios from "axios";

export const getTags = async () => {
  try {
    const response = await axios.get(`/api/community/tags/`);

    return response.data;
  } catch {
    return null;
  }
};

export const getTag = async (tagId: string | undefined) => {
  if (!tagId) {
    return null;
  }

  try {
    const response = await axios.get(`/api/community/tags/${tagId}/`);

    return response.data;
  } catch {
    return null;
  }
};
