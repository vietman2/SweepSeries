import axios from "axios";

export async function getCalendars() {
  try {
    const response = await axios.get("/v1/calendars/");
    return response.data;
  } catch {
    return null;
  }
}

export async function getMonthlyData(
  uuid: string,
  month: string,
  type: string
) {
  try {
    const response = await axios.get("/v1/calendars/monthly/", {
      params: {
        month: month,
        type: type,
        uuid: uuid,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function getDailyData(
  uuid: string | undefined,
  date: string,
  type: string | undefined
) {
  if (!uuid || !type) {
    return null;
  }

  try {
    const response = await axios.get("/v1/calendars/daily/", {
      params: {
        date: date,
        type: type,
        uuid: uuid,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function updateCalendarInfo(data: {
  title?: string;
  color?: string;
}) {
  try {
    const response = await axios.patch(`/v1/calendars/info/`, data);

    return response.data;
  } catch {
    return null;
  }
}

export async function toggleCalendarNotification(data: {
  type: string;
  uuid?: string;
}) {
  if (data.type === "academy" && !data.uuid) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/calendars/notifications/`, data);

    return response.data;
  } catch {
    return null;
  }
}

export async function toggleCalendarDaily(data: {
  type: string;
  uuid?: string;
  time?: string;
}) {
  if (data.type === "academy" && !data.uuid) {
    return null;
  }

  try {
    const response = await axios.patch(`/v1/calendars/dailynoti/`, data);
    return response.data;
  } catch {
    return null;
  }
}

export async function switchCalendarScope(uuid: string, scope: number) {
  try {
    const response = await axios.patch(`/v1/calendars/scope/`, {
      uuid: uuid,
      scope: scope,
    });

    return response.data;
  } catch {
    return null;
  }
}
