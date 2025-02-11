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

export async function getAcademyStudentDetail(
  academyId: string,
  studentId: string
) {
  try {
    const response = await axios.get(
      `/v1/academies/${academyId}/students/${studentId}/`
    );

    return response.data;
  } catch {
    return null;
  }
}
