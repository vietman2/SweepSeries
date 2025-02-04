import axios from "axios";
import FormData from "form-data";
import { ImagePickerAsset } from "expo-image-picker";

export async function createNotice(
  academyId: string,
  type: string,
  title: string,
  content: string,
  image: ImagePickerAsset | undefined
) {
  try {
    const form = new FormData();
    form.append("type", type);
    form.append("title", title);
    form.append("content", content);

    if (image) {
      form.append("image", {
        uri: image.uri,
        name: image.fileName,
      });
    }

    const response = await axios.post(
      `/v1/academies/${academyId}/notices/`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch {
    return null;
  }
}

export async function getNotices(academyId: string) {
  try {
    const response = await axios.get(`/v1/academies/${academyId}/notices/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function getNotice(academyId: string, noticeId: string) {
  try {
    const response = await axios.get(
      `/v1/academies/${academyId}/notices/${noticeId}/`
    );

    return response.data;
  } catch {
    return null;
  }
}

export async function deleteNotice(academyId: string, noticeId: string) {
  try {
    await axios.delete(
      `/v1/academies/${academyId}/notices/${noticeId}/`
    );

    return true;
  } catch {
    return null;
  }
}

export async function editNotice(
  academyId: string,
  noticeId: string,
  title: string,
  content: string
) {
  try {
    const response = await axios.patch(
      `/v1/academies/${academyId}/notices/${noticeId}/`,
      {
        title,
        content,
      }
    );

    return response.data;
  } catch {
    return null;
  }
}
