import { StudentLessonsType, StudentSimpleType } from "@models/products";
import { sampleLessonSimple } from "@testdata/calendar";

export const sampleStudents: StudentSimpleType[] = [
  {
    id: 1,
    name: "홍길동",
    phone_number: "010-1234-5678",
    profile_image: "https://via.placeholder.com/150",
    default_color: "#FF0000",
  },
  {
    id: 2,
    name: "김철수",
    phone_number: "010-1234-5678",
    profile_image: "https://via.placeholder.com/150",
    default_color: "#FF0000",
  },
  {
    id: 3,
    name: "박영희",
    phone_number: "010-1234-5678",
    profile_image: "https://via.placeholder.com/150",
    default_color: "#FF0000",
  },
];

export const sampleStudentLesson: StudentLessonsType = {
  id: 1,
  name: "홍길동",
  lessons: [sampleLessonSimple],
};
