import axios from "axios";

export async function createTodo(
  calendarId: number | undefined,
  title: string,
  date: Date | undefined,
  color: string
) {
  if (!calendarId || !date) return null;

  try {
    await axios.post("/v1/todos/", {
      calendar_id: calendarId,
      title,
      deadline: date.toISOString().split("T")[0],
      color,
    });

    return true;
  } catch {
    return null;
  }
}
