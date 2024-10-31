import { ScheduleSimpleType, ScheduleResponseType } from "@models/calendar";

export const sampleSchedules: ScheduleSimpleType[] = [
  {
    text: "길동 레슨 1",
    color: "#14863E",
  },
  {
    text: "길동 레슨 2",
    color: "#14863E",
  },
];

export const sampleScheduleResponse: ScheduleResponseType = {
  "2024-10-03": [
    {
      text: "개천절",
      color: "#FF0000",
    },
  ],
  "2024-10-09": [
    {
      text: "한글날",
      color: "#FF0000",
    },
  ],
  "2024-10-29": [
    {
      text: "길동 레슨 1",
      color: "#14863E",
    },
  ],
  "2024-10-31": [
    {
      text: "길동 레슨 2",
      color: "#14863E",
    },
    {
      text: "길순 레슨 1",
      color: "#14863E",
    },
  ],
};
