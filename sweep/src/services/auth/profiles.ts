import axios from "axios";
import FormData from "form-data";
import { ImagePickerAsset } from "expo-image-picker";

export async function updateProfile(
  id: number | undefined,
  nickname: string,
  birth: string,
  introduction: string
) {
  if (!id) return null;

  try {
    const response = await axios.patch(`/v1/profiles/${id}/`, {
      nickname,
      birthdate: birth,
      introduction,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function uploadProfileImage(
  id: number | undefined,
  image: ImagePickerAsset
) {
  if (!id) return null;

  try {
    const form = new FormData();
    form.append("profile_image", {
      uri: image.uri,
      name: image.fileName,
    });

    const response = await axios.patch(`/v1/profiles/${id}/image/`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
