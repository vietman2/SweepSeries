import axios from "axios";

export async function getAgreements() {
  try {
    const response = await axios.get("/v1/agreements/");

    return response.data;
  } catch {
    return null;
  }
}

export async function getAgreementContent(id: string) {
  try {
    const response = await axios.get(`/v1/agreements/${id}/`);

    return response.data;
  } catch {
    return null;
  }
};
