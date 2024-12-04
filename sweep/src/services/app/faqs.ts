import axios from "axios";

export async function getFAQs(category: string) {
  try {
    const response = await axios.get("/v1/faqs/", {
      params: {
        category,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
