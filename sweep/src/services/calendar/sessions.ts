import axios from "axios";

export async function getSessions(month: string) {
  try {
    const response = await axios.get("/v1/sessions/", {
      params: { month },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getSessionDetails(sessionId: string) {
  try {
    const response = await axios.get(`/v1/sessions/${sessionId}/`);

    return response.data;
  } catch {
    return null;
  }
}

export async function getSessionAvailableTimes(
  sessionId: string,
  date: string
) {
  if (date === "") return null;

  try {
    const response = await axios.get(
      `/v1/sessions/${sessionId}/available_times/`,
      {
        params: { date },
      }
    );

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

export async function requestSessionScheduleChange(
  sessionId: string,
  date: string,
  time: string
) {
  try {
    const response = await axios.post(
      `/v1/sessions/${sessionId}/schedule_change/`,
      { date, time }
    );

    return response.data;
  } catch {
    return null;
  }
}
