import axios from "axios";

export async function createComment(
  postId: string | undefined,
  content: string,
  selectedProfileId: number | undefined
) {
  if (!postId || !selectedProfileId) return null;

  try {
    await axios.post(`/v1/comments/`, {
      post: postId,
      content,
      profile: selectedProfileId,
    });

    return true;
  } catch {
    return null;
  }
}

export async function deleteComment(id: number) {
  try {
    await axios.delete(`/v1/comments/${id}/`);

    return true;
  } catch {
    return null;
  }
}

export async function likeComment(
  id: number,
  selectedProfileId: number | null
) {
  try {
    await axios.post(`/v1/comments/${id}/like/`, {
      profile: selectedProfileId,
    });

    return true;
  } catch {
    return null;
  }
}
