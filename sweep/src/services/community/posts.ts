import axios from "axios";

export async function getPosts(forum?: string, tag?: number, search?: string) {
  try {
    const response = await axios.get("/v1/posts/", {
      params: {
        forum,
        tag,
        search,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
