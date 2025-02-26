import {
  getCalendars,
  getMonthlyData,
  getDailyData,
  updateCalendarInfo,
  toggleCalendarDaily,
  toggleCalendarNotification,
  switchCalendarScope,
} from "./calendars";
import { createDiary } from "./diaries";
import { createLesson, getCurriculum } from "./lessons";
import { createSchedule } from "./schedules";
import {
  getSessions,
  getSessionDetails,
  updateSessionFeedback,
  updateSessionNotes,
} from "./sessions";
import { createTodo, toggleTodoStatus } from "./todos";

export {
  getCalendars,
  getMonthlyData,
  getDailyData,
  updateCalendarInfo,
  toggleCalendarDaily,
  toggleCalendarNotification,
  switchCalendarScope,
  createDiary,
  createLesson,
  getCurriculum,
  createSchedule,
  getSessions,
  getSessionDetails,
  updateSessionFeedback,
  updateSessionNotes,
  createTodo,
  toggleTodoStatus,
};
