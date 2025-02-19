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
