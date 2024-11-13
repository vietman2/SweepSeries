import { ScheduleSimpleType, ScheduleResponseType } from "@models/calendar";

export const sampleSchedules: ScheduleSimpleType[] = [
  {
    id: 1,
    time: "오전 9시 ~ 오전 11시 (2시간)",
    type: "레슨",
    name: "엘리트 (고등학생) 1:1 타격레슨",
    detail: "코치: 홍길동",
    color: "#14863E",
    short_text: "길동 레슨 1",
  },
  {
    id: 2,
    time: "오후 3시 ~ 오후 5시 (2시간)",
    type: "레슨",
    name: "엘리트 (고등학생) 1:1 타격레슨",
    detail: "코치: 홍길동",
    color: "#14863E",
    short_text: "길동 레슨 2",
    note: "초등학교 6학년 / 포지션은 유격수\n야구한지 6개월 정도 됐는데 학부모가 타격 욕심이 큼",
  },
  {
    id: 3,
    time: "오후 5시 ~ 오후 7시 (2시간)",
    type: "일반",
    name: "대관",
    detail: "",
    color: "#FF5833",
    short_text: "캐치비 대관",
  },
];

export const sampleScheduleResponse: ScheduleResponseType = {
  "2024-11-09": [
    {
      id: 1,
      time: "오전 9시 ~ 오전 11시 (2시간)",
      type: "레슨",
      name: "엘리트 (고등학생) 1:1 타격레슨",
      detail: "코치: 홍길동",
      color: "#14863E",
      short_text: "길동 레슨 1",
    },
  ],
  "2024-11-11": [
    {
      id: 2,
      time: "오후 3시 ~ 오후 5시 (2시간)",
      type: "레슨",
      name: "엘리트 (고등학생) 1:1 타격레슨",
      detail: "코치: 홍길동",
      color: "#14863E",
      short_text: "길동 레슨 2",
    },
    {
      id: 3,
      time: "오후 5시 ~ 오후 7시 (2시간)",
      type: "레슨",
      name: "엘리트 (고등학생) 1:1 타격레슨",
      detail: "코치: 홍길동",
      color: "#14863E",
      short_text: "길순 레슨 2",
    },
  ],
  "2024-11-13": [
    {
      id: 4,
      time: "오후 1시 ~ 오후 3시 (2시간)",
      type: "레슨",
      name: "엘리트 (고등학생) 1:1 타격레슨",
      detail: "코치: 홍길동",
      color: "#14863E",
      short_text: "길동 레슨 3",
      note: "초등학교 6학년 / 포지션은 유격수\n야구한지 6개월 정도 됐는데 학부모가 타격 욕심이 큼",
    },
    {
      id: 5,
      time: "오후 3시 ~ 오후 5시 (2시간)",
      type: "대관",
      name: "캐치비 아카데미 대관",
      detail: "",
      color: "#FF5833",
      short_text: "캐치비 대관",
    },
    {
      id: 6,
      time: "오후 9시 ~ 오후 10시 (1시간)",
      type: "일반",
      name: "캐치비 베이스볼 코치진 월간 정기 미팅",
      detail: "",
      color: "#87CEEB",
      short_text: "코치진 미팅",
    },
  ],
};
