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

export const createTag = async (forum: string, label: string, icon: string, color: string, bgColor: string) => {
  try {
    const response = await axios.post(`/api/community/tags/`, {
      forum_name: forum,
      name: label,
      icon,
      color,
      bgcolor: bgColor,
    });

    return response.data;
  } catch {
    return null;
  }
}

export const deleteTag = async (tagId: string | undefined) => {
  if (!tagId) {
    return null;
  }

  try {
    await axios.delete(`/api/community/tags/${tagId}/`);

    return true;
  } catch {
    return null;
  }
};
