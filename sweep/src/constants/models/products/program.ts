export type ProgramSimpleType = {
  id: number;
  name: string;
  rating: number;
  positions: PositionTargetType[];
  target: PositionTargetType;
  lowest_price: number;
  duration: number;
  academy_uuid: string;
};

export type PositionTargetType = {
  id: number;
  name: string;
};
