import axios from "axios";

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
