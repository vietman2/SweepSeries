import axios from "axios";

export async function getTerms() {
  try {
    const response = await axios.get("/v1/agreements/");

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
    await axios.post("/v1/agreements/", {
      title,
      content,
      required: isRequired,
    });

    return true;
  } catch {
    return null;
  }
}
