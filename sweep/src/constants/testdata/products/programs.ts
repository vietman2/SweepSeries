import { ProgramSimpleType, PositionTargetType } from "@models/products";

export const sampleProgramPositions: PositionTargetType[] = [
  {
    id: 1,
    name: "투수레슨",
  },
  {
    id: 2,
    name: "타격레슨",
  },
];

export const sampleProgramTargets: PositionTargetType[] = [{
  id: 1,
  name: "선수반",
}, {
  id: 2,
  name: "사회인야구반",
}];

export const sampleAcademyPrograms: ProgramSimpleType[] = [
  {
    id: 1,
    name: "엘리트선수(중학생) 1:1 개인레슨 (60분)",
    rating: 4.89,
    target: sampleProgramTargets[0],
    positions: sampleProgramPositions,
    lowest_price: 150000,
  },
  {
    id: 2,
    name: "엘리트선수(초등학생) 1:1 개인레슨 (60분)",
    rating: 3.94,
    target: sampleProgramTargets[0],
    positions: sampleProgramPositions,
    lowest_price: 120000,
  },
  {
    id: 3,
    name: "사회인야구 1:1 개인레슨",
    rating: 4.23,
    target: sampleProgramTargets[1],
    positions: sampleProgramPositions,
    lowest_price: 80000,
  },
  {
    id: 4,
    name: "사회인야구 1:4 그룹레슨",
    rating: 4.67,
    target: sampleProgramTargets[1],
    positions: sampleProgramPositions,
    lowest_price: 80000,
  },
];
