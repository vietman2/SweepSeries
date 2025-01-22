import { ScheduleType, ScheduleResponseType } from "@models/calendar";

export const sampleSchedules: ScheduleType[] = [
  {
    id: 1,
    time: "오전 9시 ~ 오전 11시 (2시간)",
    type: "레슨",
    title: "엘리트 (고등학생) 1:1 타격레슨",
    description: "코치: 홍길동",
    color: "#14863E",
  },
  {
    id: 2,
    time: "오후 3시 ~ 오후 5시 (2시간)",
    type: "레슨",
    title: "엘리트 (고등학생) 1:1 타격레슨",
    description: "코치: 홍길동",
    color: "#14863E",
  },
  {
    id: 3,
    time: "오후 5시 ~ 오후 7시 (2시간)",
    type: "일반",
    title: "대관",
    description: "",
    color: "#FF5833",
  },
];

export const sampleScheduleResponse: ScheduleResponseType = {
  "2024-11-09": [
    {
      id: 1,
      title: "엘리트 (고등학생) 1:1 타격레슨",
      color: "#14863E",
    },
  ],
  "2024-11-11": [
    {
      id: 2,
      title: "엘리트 (고등학생) 1:1 타격레슨",
      color: "#14863E",
    },
    {
      id: 3,
      title: "엘리트 (고등학생) 1:1 타격레슨",
      color: "#14863E",
    },
  ],
  "2024-11-13": [
    {
      id: 4,
      title: "엘리트 (고등학생) 1:1 타격레슨",
      color: "#14863E",
    },
    {
      id: 5,
      title: "캐치비 아카데미 대관",
      color: "#FF5833",
    },
    {
      id: 6,
      title: "캐치비 베이스볼 코치진 월간 정기 미팅",
      color: "#87CEEB",
    },
  ],
};
