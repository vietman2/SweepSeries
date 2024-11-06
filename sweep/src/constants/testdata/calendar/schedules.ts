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
  "2024-11-09": [
    {
      text: "길동 레슨 1",
      color: "#14863E",
    },
  ],
  "2024-11-11": [
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
