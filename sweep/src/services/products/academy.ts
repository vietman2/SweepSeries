import axios from "axios";
import FormData from "form-data";
import { ImagePickerAsset } from "expo-image-picker";

export async function createAcademy(
  name: string,
  phone: string,
  regCode: string,
  certificate: ImagePickerAsset,
  logo: ImagePickerAsset,
  address: {
    road_address_part1: string;
    road_address_part2: string;
    building_name: string;
    zip_code: string | number;
    bcode: string;
  }
) {
  try {
    const form = new FormData();
    form.append("name", name);
    form.append("phone", phone);
    form.append("registration_number", regCode);
    form.append("certification", {
      uri: certificate.uri,
      name: certificate.fileName,
    });
    form.append("main_logo", {
      uri: logo.uri,
      name: logo.fileName,
    });
    form.append("address", JSON.stringify(address));

    const response = await axios.post("/v1/academies/", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getAcademies(query?: string) {
  try {
    const response = await axios.get("/v1/academies/", {
      params: query && {
        query,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
