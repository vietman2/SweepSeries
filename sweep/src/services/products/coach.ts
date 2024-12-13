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

export async function getCoaches(academyId: string) {
  try {
    const response = await axios.get("/v1/coaches/", {
      params: { academy: academyId },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getCoachDetails(coachId: string) {
  try {
    const response = await axios.get(`/v1/coaches/${coachId}/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function getEmployedCoaches(academyId: string) {
  try {
    const repsonse = await axios.get(`/v1/academies/${academyId}/employees/`);

    return repsonse.data;
  } catch {
    return null;
  }
}

export async function acceptCoach(coachId: string) {
  try {
    const response = await axios.post(`/v1/coaches/${coachId}/accept/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function rejectCoach(coachId: string) {
  try {
    const response = await axios.post(`/v1/coaches/${coachId}/deny/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function getMyCoachProfile() {
  try {
    const response = await axios.get("/v1/coaches/me/");

    return response.data;
  } catch {
    return null;
  }
}

export async function updateCoachIntro(
  uuid: string | undefined,
  introduction: string
) {
  if (!uuid) return null;

  try {
    const response = await axios.patch(`/v1/coaches/${uuid}/introduction/`, {
      introduction,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function updateCoachSNS(uuid: string | undefined, instagram: string, blog: string) {
  if (!uuid) return null;

  try {
    const response = await axios.patch(`/v1/coaches/${uuid}/sns/`, {
      instagram,
      blog,
    });

    return response.data;
  } catch {
    return null;
  }
}
