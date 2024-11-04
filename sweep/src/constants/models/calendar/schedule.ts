export type ScheduleSimpleType = {
  text: string;
  color: string;
};

export type ScheduleResponseType = {
  [date: string]: ScheduleSimpleType[];
};
