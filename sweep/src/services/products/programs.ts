import axios from "axios";

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
  target: number,
  positions: number[],
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
      target,
      positions,
      curriculums,
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
