import { CalendarMemberType, CalendarType } from "@models/calendar";

const calendarOwner: CalendarMemberType = {
  uuid: "1",
  name: "홍길동",
  profile_image: "https://picsum.photos/200",
};

const calendarMembers: CalendarMemberType[] = [
  {
    uuid: "2",
    name: "김철수",
    profile_image: "https://picsum.photos/200",
  },
  {
    uuid: "3",
    name: "이영희",
    profile_image: "https://picsum.photos/200",
  },
];

export const sampleCalendars: CalendarType[] = [
  {
    id: 1,
    title: "Catch B 캘린더",
    color: "#FFD700",
    owner: calendarOwner,
    members: [],
  },
  {
    id: 2,
    title: "홍길동 코치 개인 캘린더",
    color: "#FF6B6B",
    owner: calendarOwner,
    members: calendarMembers,
  },
];
