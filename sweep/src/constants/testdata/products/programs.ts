import { sampleCoaches } from "./coaches";
import {
  ProgramSimpleType,
  PositionTargetType,
  OptionType,
  TeamType,
  AvailableTimesType,
} from "@models/products";

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

export const sampleProgramTargets: PositionTargetType[] = [
  {
    id: 1,
    name: "선수반",
  },
  {
    id: 2,
    name: "사회인야구반",
  },
];

export const sampleCurriculums = [
  {
    id: 1,
    num_lessons: 10,
    price: 10000,
  },
  {
    id: 2,
    num_lessons: 10,
    price: 10000,
  },
];

export const sampleCoachTeam: TeamType = {
  id: 1,
  coaches: sampleCoaches,
};

export const sampleAcademyPrograms: ProgramSimpleType[] = [
  {
    id: 1,
    name: "엘리트선수(중학생) 1:1 개인레슨 (60분)",
    rating: 4.89,
    target: sampleProgramTargets[0],
    positions: [sampleProgramPositions[0]],
    lowest_price: 150000,
    duration: 60,
    academy_uuid: "1",
    curriculums: sampleCurriculums,
    random_assignment: true,
    teams: [],
  },
  {
    id: 2,
    name: "엘리트선수(초등학생) 1:1 개인레슨 (60분)",
    rating: 3.94,
    target: sampleProgramTargets[0],
    positions: sampleProgramPositions,
    lowest_price: 120000,
    duration: 60,
    academy_uuid: "1",
    curriculums: sampleCurriculums,
    random_assignment: false,
    teams: [sampleCoachTeam],
  },
  {
    id: 3,
    name: "사회인야구 1:1 개인레슨",
    rating: 4.23,
    target: sampleProgramTargets[1],
    positions: sampleProgramPositions,
    lowest_price: 80000,
    duration: 60,
    academy_uuid: "1",
    curriculums: sampleCurriculums,
    random_assignment: true,
    teams: [],
  },
  {
    id: 4,
    name: "사회인야구 1:4 그룹레슨",
    rating: 4.67,
    target: sampleProgramTargets[1],
    positions: sampleProgramPositions,
    lowest_price: 80000,
    duration: 60,
    academy_uuid: "1",
    curriculums: sampleCurriculums,
    random_assignment: true,
    teams: [],
  },
];

export const timeOptions: OptionType[] = [
  { id: 30, name: "30분" },
  { id: 60, name: "60분" },
  { id: 90, name: "90분" },
  { id: 120, name: "120분" },
  { id: 150, name: "150분" },
  { id: 180, name: "180분" },
];

export const sampleAvailableTimes: AvailableTimesType[] = [
  {
    time: "09:00",
    is_available: true,
  },
  {
    time: "09:30",
    is_available: true,
  },
  {
    time: "10:00",
    is_available: false,
  },
  {
    time: "10:30",
    is_available: false,
  },
];
