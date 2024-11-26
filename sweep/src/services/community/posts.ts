import axios from "axios";

export async function getPosts(selectedProfileId: number | null, forum?: string, tag?: number, search?: string) {
  try {
    const response = await axios.get("/v1/posts/", {
      params: {
        profile: selectedProfileId,
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

export async function getPostDetail(id: string, selectedProfileId: number | null) {
  try {
    const response = await axios.get(`/v1/posts/${id}/`, {
      params: selectedProfileId && {
        profile: selectedProfileId,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
