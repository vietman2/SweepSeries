import { LessonType } from "@models/calendar";

export type StudentSimpleType = {
  id: number;
  name: string;
  phone_number: string;
  profile_image: string;
  default_color: string;
};

export type StudentInputType = {
  phone: string;
  id: number;
  name?: string;
}

export type StudentLessonsType = {
  id: number;
  name: string;
  lessons: LessonType[];
};
