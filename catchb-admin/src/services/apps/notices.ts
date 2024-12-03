import axios from "axios";

export const getNotices = async () => {
  try {
    const response = await axios.get("/v1/notices/");

    return response.data;
  } catch {
    return null;
  }
};

export async function getNotice(id: string | undefined) {
  if (!id) return null;

  try {
    const response = await axios.get(`/v1/notices/${id}`);

    return response.data;
  } catch {
    return null;
  }
}

export async function createNotice(title: string, content: string) {
  try {
    await axios.post("/v1/notices/", {
      title,
      content,
    });

    return true;
  } catch {
    return null;
  }
}

export async function updateNotice(
  id: string | undefined,
  title: string,
  content: string
) {
  if (!id) return null;

  try {
    await axios.put(`/v1/notices/${id}/`, {
      title,
      content,
    });

    return true;
  } catch {
    return null;
  }
}

export async function deleteNotice(id: string | undefined) {
  if (!id) return null;

  try {
    await axios.delete(`/v1/notices/${id}`);

    return true;
  } catch {
    return null;
  }
}
