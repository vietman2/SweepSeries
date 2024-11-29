import axios from "axios";

export async function getPostReports() {
  try {
    const response = await axios.get("/v1/reports/posts");
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getPostReportDetails(reportId: string  | undefined) {
  if (!reportId) return null;

  try {
    const response = await axios.get(`/v1/reports/posts/${reportId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function updatePostReport(reportId: string | undefined, accept: boolean, feedback: string) {
  if (!reportId) return null;

  try {
    await axios.patch(`/v1/reports/posts/${reportId}/`, {
      accept,
      feedback,
    });
    return true;
  } catch (error) {
    return null;
  }
}
