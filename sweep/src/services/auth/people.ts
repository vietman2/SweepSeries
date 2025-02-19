import axios from "axios";

export async function searchPerson(phone: string) {
  try {
    const response = await axios.get(`/v1/people/?phone=${phone}`);

    return response.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 404) {
        return "NOT_FOUND";
      }
    }

    return null;
  }
}
