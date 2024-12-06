import axios from "axios";

export async function getNotices() {
  try {
    const response = await axios.get("/v1/notices/");

    return response.data;
  } catch {
    return null;
  }
}
