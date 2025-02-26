import axios from "axios";

export async function createTodo(
  title: string,
  date: Date | undefined,
  color: string
) {
  if (!date) return null;

  try {
    await axios.post("/v1/todos/", {
      title,
      deadline: date.toISOString().split("T")[0],
      color,
    });

    return true;
  } catch {
    return null;
  }
}

export async function toggleTodoStatus(todoId: number) {
  try {
    await axios.patch(`/v1/todos/${todoId}/toggle/`);

    return true;
  } catch {
    return null;
  }
}
