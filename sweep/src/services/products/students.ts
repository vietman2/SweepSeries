import axios from "axios";

export async function getStudents(
  uuid: string | undefined,
  mode: "academy" | "coach" | null,
  query?: string
) {
  if (!mode || !uuid) {
    return null;
  }

  try {
    const response = await axios.get(`/v1/academies/${uuid}/students/`, {
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
  studentId: string,
  month: string
) {
  if (month === "") return null;

  try {
    const response = await axios.get(
      `/v1/academies/${academyId}/students/${studentId}/`,
      {
        params: {
          month,
        },
      }
    );

    return response.data;
  } catch {
    return null;
  }
}
