import axios from "axios";

export const getAcademies = async (status: string) => {
  try {
    const response = await axios.get("/v1/academies/", {
      params: {
        status: status,
      },
    });

    return response.data;
  } catch {
    return null;
  }
};

export const approveAcademy = async (academyId: string) => {
  try {
    const response = await axios.post(`/v1/academies/${academyId}/approve/`);

    return response.data;
  } catch {
    return null;
  }
};

export const rejectAcademy = async (
  academyId: string,
  rejectReason: string
) => {
  try {
    const response = await axios.post(`/v1/academies/${academyId}/reject/`, {
      reject_reason: rejectReason,
    });

    return response.data;
  } catch {
    return null;
  }
};
