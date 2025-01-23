export type ScheduleType = {
  id: number;
  time: string;
  type: string;
  title: string;
  description: string;
  color: string;
};

export type ScheduleSimpleType = {
  id: number;
  title: string;
  color: string;
}

export type ScheduleResponseType = {
  [date: string]: ScheduleSimpleType[];
};

export type LessonDetailType = {
  id: number;
  date: string;
  time: string;
  status: string;
  color: string;
  program: string;
  coach: string;
  player: string;
  note: string;
  feedback: string;
};
