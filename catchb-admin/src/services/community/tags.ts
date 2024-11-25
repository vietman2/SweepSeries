import axios from "axios";

export const getTags = async () => {
  try {
    const response = await axios.get(`/v1/tags/`);

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
    const response = await axios.get(`/v1/tags/${tagId}/`);

    return response.data;
  } catch {
    return null;
  }
};

export const createTag = async (
  forum: string,
  label: string,
  icon: string,
  color: string,
  bgColor: string
) => {
  try {
    const response = await axios.post(`/v1/tags/`, {
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
};

export const updateTag = async (
  tagId: string | undefined,
  forum: string,
  label: string,
  icon: string,
  color: string,
  bgColor: string
) => {
  if (!tagId) {
    return null;
  }

  try {
    const response = await axios.put(`/v1/tags/${tagId}/`, {
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
};

export const deleteTag = async (tagId: string | undefined) => {
  if (!tagId) {
    return null;
  }

  try {
    await axios.delete(`/v1/tags/${tagId}/`);

    return true;
  } catch {
    return null;
  }
};
