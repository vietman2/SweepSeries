import axios from "axios";

export async function getPostReports() {
  try {
    const response = await axios.get("/v1/reports/posts");
    return response.data;
  } catch {
    return null;
  }
}

export async function getPostReportDetails(reportId: string | undefined) {
  if (!reportId) return null;

  try {
    const response = await axios.get(`/v1/reports/posts/${reportId}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function updatePostReport(
  reportId: string | undefined,
  accept: boolean,
  feedback: string
) {
  if (!reportId) return null;

  try {
    await axios.patch(`/v1/reports/posts/${reportId}/`, {
      accept,
      feedback,
    });
    return true;
  } catch {
    return null;
  }
}

export async function getCommentReports() {
  try {
    const response = await axios.get("/v1/reports/comments");
    return response.data;
  } catch {
    return null;
  }
}

export async function getCommentReportDetails(reportId: string | undefined) {
  if (!reportId) return null;

  try {
    const response = await axios.get(`/v1/reports/comments/${reportId}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function updateCommentReport(
  reportId: string | undefined,
  accept: boolean,
  feedback: string
) {
  if (!reportId) return null;

  try {
    await axios.patch(`/v1/reports/comments/${reportId}/`, {
      accept,
      feedback,
    });
    return true;
  } catch {
    return null;
  }
}

export async function getReCommentReports() {
  try {
    const response = await axios.get("/v1/reports/recomments");
    return response.data;
  } catch {
    return null;
  }
}

export async function getReCommentReportDetails(reportId: string | undefined) {
  if (!reportId) return null;

  try {
    const response = await axios.get(`/v1/reports/recomments/${reportId}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function updateReCommentReport(
  reportId: string | undefined,
  accept: boolean,
  feedback: string
) {
  if (!reportId) return null;

  try {
    await axios.patch(`/v1/reports/recomments/${reportId}/`, {
      accept,
      feedback,
    });
    return true;
  } catch {
    return null;
  }
}
