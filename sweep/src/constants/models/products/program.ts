export type ProgramSimpleType = {
  id: number;
  name: string;
  rating: number;
  positions: PositionTargetType[];
  target: PositionTargetType;
  lowest_price: number;
};

export type PositionTargetType = {
  id: number;
  name: string;
};
