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

export async function getCalendarData(id: number | undefined, query: string, type: string) {
  // type == "month" 이면, paramdms {month: "2021-09"} 형태로 
  // type == "day" 이면, params {day: "2021-09-01"} 형태로
  if (!id) {
    return null;
  }

  const params = {
    [type]: query,
  };

  try {
    const response = await axios.get(`/v1/calendars/${id}/schedules/`, {
      params,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function createCalendar() {
  try {
    const response = await axios.post("/v1/calendars/");
    return response.data;
  } catch {
    return null;
  }
}

export async function deleteCalendar(id: number | undefined) {
  if (!id) {
    return null;
  }
  
  try {
    await axios.delete(`/v1/calendars/${id}/`);
    return true;
  } catch {
    return null;
  }
}

export async function leaveCalendar(id: number | undefined) {
  if (!id) {
    return null;
  }

  try {
    await axios.delete(`/v1/calendars/${id}/leave/`);
    return true;
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

export async function toggleCalendarNotification(id: number | undefined) {
  if (!id) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/calendars/${id}/notification/`);
    return response.data;
  } catch {
    return null;
  }
}

export async function toggleCalendarDaily(id: number | undefined, time: string) {
  if (!id) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/calendars/${id}/daily/`, {
      time,
    });
    return response.data;
  } catch {
    return null;
  }
}
