export type ScheduleType = {
  id: string;
  time: string;
  title: string;
  description: string;
  color: string;
};

export type ScheduleSimpleType = {
  id: string;
  title: string;
  color: string;
}

export type ScheduleResponseType = {
  [date: string]: ScheduleSimpleType[];
};

export type LessonType = {
  done: boolean;
  date: string;
} & ScheduleType;

export type LessonDetailType = {
  notes: string;
  feedback: string;
  coaches: number[];
  student: string;
} & LessonType;

export type LessonRequestType = {
  id: number;
  time: string;
  title: string;
  description: string;
  details: string;
  color: string;
  date: string;
}
