import axios from "axios";

export async function getReviews() {
  try {
    const response = await axios.get("/v1/reviews/");
    return response.data;
  } catch {
    return null;
  }
}

export async function getTagOptions() {
  try {
    const response = await axios.get("/v1/reviews/tags/");
    return response.data;
  } catch {
    return null;
  }
}
