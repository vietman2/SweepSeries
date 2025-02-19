import { CurriculumType, StudentInputType } from "@models/products";
import axios from "axios";

export async function createLesson(
  programId: number,
  coachIds: string[],
  startDateTime: Date,
  person: StudentInputType,
  curriculum: CurriculumType
) {
  try {
    const response = await axios.post("/v1/lessons/", {
      program: programId,
      coaches: coachIds,
      start_datetime: startDateTime,
      person,
      curriculum_id: curriculum.id,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getCurriculum(programId: number, studentId: number) {
  try {
    const response = await axios.get("/v1/lessons/", {
      params: {
        program: programId,
        student: studentId,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
