import axios from "axios";

export async function getInquiries() {
  try {
    const response = await axios.get("/v1/inquiries/");

    return response.data;
  } catch {
    return null;
  }
}

export async function createInquiry(title: string, content: string) {
  try {
    await axios.post("/v1/inquiries/", { title, description: content });

    return true;
  } catch {
    return null;
  }
}
