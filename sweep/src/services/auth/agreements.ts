import axios from "axios";

export async function getAgreements() {
  try {
    const response = await axios.get("/api/agreements/");

    return response.data;
  } catch {
    return null;
  }
}
