import axios from "axios";

export async function createDiary(diary: string, date: string) {
  try {
    const response = await axios.post("/v1/diaries/", {
      diary,
      date,
    });

    return response.data;
  } catch {
    return null;
  }
}
