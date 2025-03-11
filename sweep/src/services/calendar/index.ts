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
import {
  createLesson,
  getCurriculum,
  getLessonRequests,
  acceptRequests,
  rejectRequests,
} from "./lessons";
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
  getLessonRequests,
  acceptRequests,
  rejectRequests,
  createSchedule,
  getSessions,
  getSessionDetails,
  updateSessionFeedback,
  updateSessionNotes,
  createTodo,
  toggleTodoStatus,
};
