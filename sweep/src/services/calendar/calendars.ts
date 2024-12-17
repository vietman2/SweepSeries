import axios from "axios";

export async function getCalendars() {
  try {
    const response = await axios.get("/v1/calendars/");
    return response.data;
  } catch {
    return null;
  }
}

export async function getCalendar(id: string) {
  try {
    const response = await axios.get(`/v1/calendars/${id}/`);
    return response.data;
  } catch {
    return null;
  }
}

export async function updateCalendarInfo(id: number, name: string, color: string) {
  try {
    const response = await axios.patch(`/v1/calendars/${id}/`, {
      name,
      color,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function toggleCalendarNotification(id: string) {
  try {
    const response = await axios.patch(`/v1/calendars/${id}/notification/`);
    return response.data;
  } catch {
    return null;
  }
}

export async function toggleCalendarDaily(id: string, time: string) {
  try {
    const response = await axios.patch(`/v1/calendars/${id}/daily/`, {
      time,
    });
    return response.data;
  } catch {
    return null;
  }
}
