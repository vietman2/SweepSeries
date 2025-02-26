import axios from "axios";

import { CurriculumType } from "@models/products";

export async function getTargets() {
  try {
    const response = await axios.get("/v1/programs/targets/");
    return response.data;
  } catch {
    return null;
  }
}

export async function getPositions() {
  try {
    const response = await axios.get("/v1/programs/positions/");
    return response.data;
  } catch {
    return null;
  }
}

export async function createProgram(
  academy_id: string,
  name: string,
  duration: number,
  target_id: number,
  positions_id: number[],
  curriculums: {
    num_lessons: number;
    price: number;
  }[]
) {
  try {
    const response = await axios.post("/v1/programs/", {
      academy: academy_id,
      name,
      duration,
      target_id,
      positions_id,
      curriculums,
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function deleteProgram(program_id: number | undefined) {
  if (!program_id) {
    return null;
  }

  try {
    const response = await axios.delete(`/v1/programs/${program_id}/`);
    return response.data;
  } catch {
    return null;
  }
}

export async function editProgram(
  program_id: number | undefined,
  name: string,
  duration: number,
  target_id: number,
  positions_id: number[]
) {
  if (!program_id) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/programs/${program_id}/`, {
      name,
      duration,
      target_id,
      positions_id,
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function getPrograms(uuid: string) {
  try {
    const response = await axios.get(`/v1/programs/?academy=${uuid}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function getProgramsByProfile(profile_id: number | undefined) {
  if (!profile_id) {
    return null;
  }

  try {
    const response = await axios.get(`/v1/programs/?profile=${profile_id}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function getProgramDetail(id: string) {
  try {
    const response = await axios.get(`/v1/programs/${id}/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function addCoachTeam(
  programId: number | undefined,
  coach_uuids: string[]
) {
  if (!programId) {
    return null;
  }

  try {
    const response = await axios.post(`/v1/programs/${programId}/coaches/`, {
      uuids: coach_uuids,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function deleteCoachTeam(
  programId: number | undefined,
  teamId: number
) {
  if (!programId) {
    return null;
  }

  try {
    const response = await axios.delete(
      `/v1/programs/${programId}/coaches/${teamId}/`
    );

    return response.data;
  } catch {
    return null;
  }
}

export async function saveCurriculums(
  programId: number | undefined,
  curriculums: CurriculumType[]
) {
  if (!programId) {
    return null;
  }

  try {
    const response = await axios.patch(
      `/v1/programs/${programId}/curriculums/`,
      { curriculums }
    );

    return response.data;
  } catch {
    return null;
  }
}

export async function toggleCoachSelect(programId: number | undefined) {
  if (!programId) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/programs/${programId}/toggle/`);

    return response.data;
  } catch {
    return null;
  }
}
