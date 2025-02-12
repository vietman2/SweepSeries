import axios from "axios";

export async function createLesson(
  programId: number,
  coachIds: string[],
  startDateTime: Date,
  person: {
    phone: string;
    id?: number;
    name?: string;
  }
) {
  try {
    const response = await axios.post("/v1/lessons/", {
      program: programId,
      coaches: coachIds,
      start_datetime: startDateTime,
      person,
    });

    return response.data;
  } catch {
    return null;
  }
}
