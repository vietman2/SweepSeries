import { CalendarType } from "@models/calendar";

export const sampleCalendars: CalendarType[] = [
  {
    uuid: "1",
    title: "Catch B 캘린더",
    color: "#FFD700",
    notifications: true,
    notifications_today: true,
    daily_time: "09:00",
    role: "owner",
    logo: "https://picsum.photos/200/200",
    num_members: 1,
    type: "PERSONAL",
  },
  {
    uuid: "2",
    title: "홍길동 코치 개인 캘린더",
    color: "#FF6B6B",
    notifications: false,
    notifications_today: false,
    daily_time: "",
    role: "owner",
    type: "ACADEMY",
  },
];
