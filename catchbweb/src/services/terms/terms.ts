import axios from "axios";

export const getTerms = async (query: string, version?: number) => {
  try {
    const response = await axios.get("/v1/agreements/", {
      params: {
        query,
        version,
      },
    });

    return response.data;
  } catch {
    return null;
  }
};
