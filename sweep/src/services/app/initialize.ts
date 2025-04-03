import axios from "axios";

export async function initialize() {
  try {
    const response = await axios.get("/v1/initialize/");

    return response.data;
  } catch {
    return null;
  }
}
