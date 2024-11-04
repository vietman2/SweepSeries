export type ProgramSimpleType = {
  id: number;
  name: string;
  rating: number;
  positions: LessonPositionType[];
  target: string;
  lowest_price: number;
};

export type LessonPositionType = {
  id: number;
  name: string;
  kor_name: string;
};
