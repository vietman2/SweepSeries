import axios from "axios";

export async function getStudents(academyId: string, query?: string) {
  try {
    const response = await axios.get(`/v1/academies/${academyId}/students/`, {
      params: {
        query,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
