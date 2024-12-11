import axios from "axios";
import FormData from "form-data";
import { ImagePickerAsset } from "expo-image-picker";

export async function createCoach(
  career: string,
  academy: string,
  certificate: ImagePickerAsset,
  profile_image: ImagePickerAsset,
  professions: string[]
) {
  try {
    const form = new FormData();
    form.append("career", career);
    form.append("academy", academy);
    form.append("certificate", {
      uri: certificate.uri,
      name: certificate.fileName,
    });
    form.append("profile_image", {
      uri: profile_image.uri,
      name: profile_image.fileName,
    });
    form.append("professions", JSON.stringify(professions));

    const response = await axios.post("/v1/coaches/", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
