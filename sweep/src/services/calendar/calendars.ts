import axios from "axios";

export async function getCalendars() {
  try {
    const response = await axios.get("/v1/calendars/");
    return response.data;
  } catch {
    return null;
  }
}
