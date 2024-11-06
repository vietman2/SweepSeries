export type CoachProfessionType = {
  id: number;
  kor_name: string;
};

export type CoachSimpleType = {
  uuid: string;
  name: string;
  profile_image: string;
  career: string;
  introduction: string;
  professions: CoachProfessionType[];
  is_liked: boolean;
  rating: number;
  num_reviews: number;
};

export type CoachDetailType = {
  uuid: string;
  name: string;
  profile_image: string;
  professions: CoachProfessionType[];
  is_liked: boolean;
  rating: number;
  num_reviews: number;
  introduction: string;
};

export type CoachRequestType = {
  uuid: string;
  name: string;
  profile_image: string;
  career: string;
  professions: CoachProfessionType[];
};
