import axios from "axios";

export const getTerms = async (query: string, version: number) => {
  try {
    const params: { query: string; version?: number } = { query };

    if (version !== -1) {
      params.version = version;
    }

    const response = await axios.get("/v1/agreements/", { params });

    return response.data;
  } catch {
    return null;
  }
};
