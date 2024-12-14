import axios from "axios";

export async function createNotice(
  academyId: string,
  title: string,
  content: string
) {
  try {
    const response = await axios.post(`/v1/academies/${academyId}/notices/`, {
      title,
      content,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getNotices(academyId: string) {
  try {
    const response = await axios.get(`/v1/academies/${academyId}/notices/`);

    return response.data;
  } catch {
    return null;
  }
}
