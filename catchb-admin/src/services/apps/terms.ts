import axios from "axios";

export async function getTerms() {
  try {
    const response = await axios.get("/v1/agreements/manage/");

    return response.data;
  } catch {
    return null;
  }
}

export async function getTerm(id: string | undefined) {
  if (!id) return null;

  try {
    const response = await axios.get(`/v1/agreements/manage/${id}`);

    return response.data;
  } catch {
    return null;
  }
}

export async function createTerms(
  title: string,
  content: string | undefined,
  isRequired: boolean
) {
  if (content === undefined) return null;

  try {
    await axios.post("/v1/agreements/manage/", {
      title,
      content,
      required: isRequired,
    });

    return true;
  } catch {
    return null;
  }
}

export async function deleteTerm(id: string | undefined) {
  if (!id) return null;

  try {
    await axios.delete(`/v1/agreements/manage/${id}`);

    return true;
  } catch {
    return null;
  }
}

export async function updateTerm(
  id: string | undefined,
  content: string | undefined,
  summary: string,
) {
  if (content === undefined || !id) return null;

  try {
    await axios.put(`/v1/agreements/manage/${id}/`, {
      content,
      summary,
    });

    return true;
  } catch {
    return null;
  }
}
