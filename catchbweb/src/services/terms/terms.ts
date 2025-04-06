import axios from "axios";

export const getTermsOfService = async (version: number | null) => {
  const params = version && { version };

  try {
    const response = await axios.get("/v1/terms_of_service/", {
      params,
    });

    return response.data;
  } catch {
    return null;
  }
};

export const getPrivacyPolicy = async (version: number | null) => {
  const params = version && { version };

  try {
    const response = await axios.get("/v1/privacy_policy/", {
      params,
    });

    return response.data;
  } catch {
    return null;
  }
};
