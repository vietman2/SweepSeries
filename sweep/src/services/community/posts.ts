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

export async function likePost(id: string, selectedProfileId: number | null) {
  try {
    await axios.post(`/v1/posts/${id}/like/`, {
      profile: selectedProfileId,
    });

    return true;
  } catch {
    return null;
  }
}
