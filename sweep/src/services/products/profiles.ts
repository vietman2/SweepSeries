import axios from "axios";

export async function getPromodeProfiles() {
  try {
    const response = await axios.get("/v1/pro/my/");

    return response.data;
  } catch {
    return null;
  }
}
