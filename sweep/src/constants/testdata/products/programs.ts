import { ProgramSimpleType, LessonPositionType } from "@models/products";

const sampleProgramPositions: LessonPositionType[] = [
  {
    id: 1,
    name: "pitchers",
    kor_name: "투수레슨",
  },
  {
    id: 2,
    name: "batters",
    kor_name: "타격레슨",
  },
];

export const sampleAcademyPrograms: ProgramSimpleType[] = [
  {
    id: 1,
    name: "엘리트선수(중학생) 1:1 개인레슨 (60분)",
    rating: 4.89,
    target: "선수반",
    positions: sampleProgramPositions,
    lowest_price: 150000,
  },
  {
    id: 2,
    name: "엘리트선수(초등학생) 1:1 개인레슨 (60분)",
    rating: 3.94,
    target: "선수반",
    positions: sampleProgramPositions,
    lowest_price: 120000,
  },
  {
    id: 3,
    name: "사회인야구 1:1 개인레슨",
    rating: 4.23,
    target: "사회인야구반",
    positions: sampleProgramPositions,
    lowest_price: 80000,
  },
  {
    id: 4,
    name: "사회인야구 1:4 그룹레슨",
    rating: 4.67,
    target: "사회인야구반",
    positions: sampleProgramPositions,
    lowest_price: 80000,
  },
];
