import axios from "axios";

export async function likeComment(id: number, selectedProfileId: number | null) {
  try {
    await axios.post(`/v1/comments/${id}/like/`, {
      profile: selectedProfileId,
    });

    return true;
  } catch {
    return null;
  }
}
