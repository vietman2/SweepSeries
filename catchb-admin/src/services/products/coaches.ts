import axios from "axios";

export const getCoaches = async (status: string) => {
  try {
    const response = await axios.get("/staff/coaches/", {
      params: {
        status: status,
      },
    });

    return response.data;
  } catch {
    return null;
  }
};

export const approveCoach = async (coachId: string) => {
  try {
    const response = await axios.post(`/staff/coaches/${coachId}/approve/`);

    return response.data;
  } catch {
    return null;
  }
};

export const rejectCoach = async (coachId: string, rejectReason: string) => {
  try {
    const response = await axios.post(`/staff/coaches/${coachId}/reject/`, {
      reject_reason: rejectReason,
    });

    return response.data;
  } catch {
    return null;
  }
};
