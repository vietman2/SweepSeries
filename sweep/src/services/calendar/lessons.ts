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

export async function getLessonRequests(academyId: string | undefined) {
  if (!academyId) {
    return null;
  }

  try {
    const response = await axios.get(`/v1/lesson_requests/`, {
      params: {
        academy: academyId,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function acceptRequests(
  requestIds: number[],
  academyId: string | undefined
) {
  if (!academyId) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/lesson_requests/accept/`, {
      requests: requestIds,
      academy: academyId,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function rejectRequests(
  requestIds: number[],
  academyId: string | undefined
) {
  if (!academyId) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/lesson_requests/reject/`, {
      requests: requestIds,
      academy: academyId,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getDailyLessons(
  uuid: string,
  date: string,
  mode: "academy" | "coach" | null
) {
  if (mode === null) {
    return null;
  }

  try {
    const response = await axios.get(`/v1/sessions/daily/`, {
      params: {
        uuid,
        date,
        mode,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
