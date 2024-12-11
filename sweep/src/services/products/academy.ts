import axios from "axios";
import FormData from "form-data";
import { ImagePickerAsset } from "expo-image-picker";

import { ScheduleDetailType } from "@models/products";

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

export async function getAcademyDetail(uuid: string) {
  try {
    const response = await axios.get(`/v1/academies/${uuid}/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function getMyAcademies() {
  try {
    const response = await axios.get("/v1/academies/my/");

    return response.data;
  } catch {
    return null;
  }
}

export async function updateAcademyIntroduction(
  uuid: string,
  introduction: string
) {
  try {
    const response = await axios.patch(`/v1/academies/${uuid}/introduction/`, {
      introduction,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getFacilityOptions() {
  try {
    const response = await axios.get("/v1/facilities/");

    return response.data;
  } catch {
    return null;
  }
}

export async function updateFacilities(uuid: string, facilities: number[]) {
  try {
    const response = await axios.patch(`/v1/academies/${uuid}/facilities/`, {
      facilities,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function updateBusinessHours(
  uuid: string,
  schedules: ScheduleDetailType[],
  isEveryday: boolean,
  isAllWeekdays: boolean,
  isAllWeekend: boolean
) {
  const form = new FormData();
  if (isEveryday) {
    const data = {
      monday: schedules[0],
      tuesday: schedules[0],
      wednesday: schedules[0],
      thursday: schedules[0],
      friday: schedules[0],
      saturday: schedules[0],
      sunday: schedules[0],
    };
    form.append("data", JSON.stringify(data));
  } else {
    if (isAllWeekdays) {
      if (isAllWeekend) {
        const data = {
          monday: schedules[0],
          tuesday: schedules[0],
          wednesday: schedules[0],
          thursday: schedules[0],
          friday: schedules[0],
          saturday: schedules[5],
          sunday: schedules[5],
        };
        form.append("data", JSON.stringify(data));
      } else {
        const data = {
          monday: schedules[0],
          tuesday: schedules[0],
          wednesday: schedules[0],
          thursday: schedules[0],
          friday: schedules[0],
          saturday: schedules[5],
          sunday: schedules[6],
        };
        form.append("data", JSON.stringify(data));
      }
    } else {
      if (isAllWeekend) {
        const data = {
          monday: schedules[0],
          tuesday: schedules[1],
          wednesday: schedules[2],
          thursday: schedules[3],
          friday: schedules[4],
          saturday: schedules[5],
          sunday: schedules[5],
        };
        form.append("data", JSON.stringify(data));
      } else {
        const data = {
          monday: schedules[0],
          tuesday: schedules[1],
          wednesday: schedules[2],
          thursday: schedules[3],
          friday: schedules[4],
          saturday: schedules[5],
          sunday: schedules[6],
        };
        form.append("data", JSON.stringify(data));
      }
    }
  }

  try {
    const response = await axios.patch(`/v1/academies/${uuid}/hours/`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
