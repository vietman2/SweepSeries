export type ScheduleSimpleType = {
  id: number;
  short_text: string;
  time: string;
  type: string;
  name: string;
  detail: string;
  color: string;
  note?: string;
};

export type ScheduleResponseType = {
  [date: string]: ScheduleSimpleType[];
};
