import axios from "axios";

export async function getSessionDetails(sessionId: string) {
  try {
    const response = await axios.get(`/v1/sessions/${sessionId}/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function updateSessionNotes(sessionId: string, notes: string) {
  try {
    await axios.patch(`/v1/sessions/${sessionId}/`, { notes });

    return true;
  } catch {
    return null;
  }
}

export async function updateSessionFeedback(
  sessionId: string,
  feedback: string
) {
  try {
    await axios.patch(`/v1/sessions/${sessionId}/`, { feedback });

    return true;
  } catch {
    return null;
  }
}
