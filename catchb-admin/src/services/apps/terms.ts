import axios from "axios";

export async function getTerms() {
  try {
    const response = await axios.get("/v1/agreements/");

    return response.data;
  } catch {
    return null;
  }
}
