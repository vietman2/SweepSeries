import axios from "axios";

export async function getPosts(forum?: string) {
  try {
    const response = await axios.get("/api/posts/", {
      params: forum && {
        forum,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
