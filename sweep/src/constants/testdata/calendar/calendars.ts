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
    name: "Catch B 캘린더",
    color: "#FFD700",
    owner: calendarOwner,
    members: [],
    is_owner: true,
    num_members: 1,
  },
  {
    id: 2,
    name: "홍길동 코치 개인 캘린더",
    color: "#FF6B6B",
    owner: calendarOwner,
    members: calendarMembers,
    is_owner: false,
    num_members: 2,
  },
];
