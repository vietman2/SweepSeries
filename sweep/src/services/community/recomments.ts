import axios from "axios";

export async function createRecomment(
  commentId: number | undefined,
  content: string,
  selectedProfileId: number | undefined
) {
  if (!commentId || !selectedProfileId) return null;

  try {
    await axios.post(`/v1/recomments/`, {
      comment: commentId,
      content,
      profile: selectedProfileId,
    });

    return true;
  } catch {
    return null;
  }
}

export async function deleteRecomment(id: number) {
  try {
    await axios.delete(`/v1/recomments/${id}/`);

    return true;
  } catch {
    return null;
  }
}

export async function likeRecomment(
  id: number,
  selectedProfileId: number | null
) {
  try {
    await axios.post(`/v1/recomments/${id}/like/`, {
      profile: selectedProfileId,
    });

    return true;
  } catch {
    return null;
  }
}
