import { CoachSimpleType } from "./coach";

export type ProgramSimpleType = {
  id: number;
  name: string;
  rating: number;
  positions: PositionTargetType[];
  target: PositionTargetType;
  lowest_price: number;
  duration: number;
  academy_uuid: string;
  curriculums: CurriculumType[];
  random_assignment: boolean;
  teams: TeamType[];
};

export type PositionTargetType = {
  id: number;
  name: string;
};

export type CurriculumType = {
  id: number;
  num_lessons: number;
  price: number;
};

export type OptionType = {
  id: number;
  name: string;
};

export type TeamType = {
  id: number;
  coaches: CoachSimpleType[];
};

export type TeamInputType = {
  coaches: CoachSimpleType[];
};

export type AvailableTimesType = {
  time: string;
  is_available: boolean;
};
